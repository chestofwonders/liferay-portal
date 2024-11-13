/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {dataApiHelpersTest} from '../../../../fixtures/dataApiHelpersTest';
import {featureFlagsTest} from '../../../../fixtures/featureFlagsTest';
import {loginTest} from '../../../../fixtures/loginTest';
import getRandomString from '../../../../utils/getRandomString';
import {dataSetManagerApiHelpersTest} from '../../fixtures/dataSetManagerApiHelpersTest';
import {dataSetsPageTest} from './fixtures/dataSetsPageTest';
import performLogin, {performLogout, userData} from '../../../../utils/performLogin';

export const test = mergeTests(
    dataApiHelpersTest,
	dataSetManagerApiHelpersTest,
	dataSetsPageTest,
	featureFlagsTest({
		'LPS-164563': true,
		'LPS-178052': true,
	}),
	loginTest()
);

let dataSetERC = getRandomString();
let dataSetLabel = getRandomString();
let dataSetUserRole;
const roleName = `ds_user_${getRandomString()}`;
let userAccount: TUserAccount;

test.beforeEach(async ({dataSetManagerApiHelpers}) => {
	await test.step('Create a data set', async () => {
		await dataSetManagerApiHelpers.createDataSet({
			erc: dataSetERC,
			label: dataSetLabel,
		});
	});
});

test.afterEach(async ({dataSetManagerApiHelpers}) => {
    await test.step('Delete the data set', async () => {
	    await dataSetManagerApiHelpers.deleteDataSet({erc: dataSetERC});
    });
});

test('Check edit permissions on Data Sets', async ({
    apiHelpers,
    dataSetsPage,
    page,
}) => {
    await test.step('Create a new user', async () => {
        userAccount = await apiHelpers.headlessAdminUser.postUserAccount();

        userData[userAccount.alternateName] = {
            name: userAccount.givenName, 
            password: 'test',
            surname: userAccount.familyName,
        };
    });

    await test.step('Create Data Set user role', async () => {
        const companyId = await page.evaluate(() => {
            return Liferay.ThemeDisplay.getCompanyId();
        });

        dataSetUserRole = await apiHelpers.headlessAdminUser.postRole({
            name: roleName,
            rolePermissions: [
                {
                    actionIds: ['VIEW_CONTROL_PANEL'],
                    primaryKey: companyId,
                    resourceName: '90',
                    scope: 1,
                },
                {
                    actionIds: ['UPDATE'],
                    primaryKey: 'com.liferay.frontend.data.set',
                    resourceName: 'com.liferay.frontend.data.set.model.DataSet',
                    scope: 4,
                },
                {
                    actionIds: ['ACCESS_IN_CONTROL_PANEL', 'VIEW'],
                    primaryKey: companyId,
                    resourceName:
                        'com_liferay_frontend_data_set_admin_web_internal_portlet_FDSAdminPortlet',
                    scope: 1,
                },
                {
                    actionIds: ['ACCESS_IN_CONTROL_PANEL', 'VIEW'],
                    primaryKey: companyId,
                    resourceName:
                        'com_liferay_client_extension_web_internal_portlet_ClientExtensionAdminPortlet',
                    scope: 1,
                },
                {
                    actionIds: ['ACCESS_IN_CONTROL_PANEL', 'VIEW'],
                    primaryKey: companyId,
                    resourceName:
                        'com_liferay_client_extension_web_internal_portlet_ClientExtensionAdminPortlet',
                    scope: 1,
                },
            ],
            roleType: 'regular',
        })
    });

    await test.step('Assign new role to user', async () => {
        await apiHelpers.headlessAdminUser.postRoleUserAccountAssociation(
            dataSetUserRole.id,
            Number(userAccount.id)
        );

        apiHelpers.data.push({
            id: `${dataSetUserRole.id}_${userAccount.id}`,
            type: 'roleUserAccountAssociation',
        });
    });

    await test.step('Do login with the new user', async () => {
        await performLogout(page);
        await performLogin(page, userAccount.alternateName);
    });

    await test.step('Navigate to Data Set page', async () => {
        await dataSetsPage.goto();
    });

    await test.step('Check that the user can not show data set actions menu', async () => {
       const datasetTestRow = await page
			.locator('.data-set-content-wrapper .dnd-tbody .dnd-tr')
			.filter({hasText: dataSetLabel});
 
        await expect(datasetTestRow
            .first()
            .getByRole('button', {name: 'Actions'})).not.toBeInViewport();
    });

    await test.step('Check that the user can not enter to Data Set details pages', async () => {
        await page.goto('http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_frontend_data_set_admin_web_internal_portlet_FDSAdminPortlet&p_p_lifecycle=0&_com_liferay_frontend_data_set_admin_web_internal_portlet_FDSAdminPortlet_mvcPath=%2Fdata_set.jsp&_com_liferay_frontend_data_set_admin_web_internal_portlet_FDSAdminPortlet_backURL=%2Fgroup%2Fguest%2F%7E%2Fcontrol_panel%2Fmanage%3Fp_p_id%3Dcom_liferay_frontend_data_set_admin_web_internal_portlet_FDSAdminPortlet%26p_p_lifecycle%3D0%26p_p_state%3Dmaximized%26p_p_mode%3Dview&_com_liferay_frontend_data_set_admin_web_internal_portlet_FDSAdminPortlet_dataSetERC=39161ebc-1651-81a9-51e0-0fe94f81eeb8&_com_liferay_frontend_data_set_admin_web_internal_portlet_FDSAdminPortlet_dataSetLabel=weqw');

        await expect(page.getByRole('button', { name: 'Details' })).not.toBeVisible();
    });

    await test.step('Do logout and login as administrator', async () => {
        await performLogout(page);
        await performLogin(page, 'test');
    });

    await test.step('Grant Data Sets view permission for the new user', async () => {
        await dataSetsPage.goto();

        const dataSetRow = await page
            .locator('.data-set-content-wrapper .dnd-tbody .dnd-tr')
            .filter({hasText: dataSetLabel});

        await dataSetRow
            .first()
            .getByRole('button', {name: 'Actions'})
            .click();

        await page.getByRole('menuitem', {name: 'Permissions'}).click();

        const permissionsModalIframe = await page.frameLocator('iframe[title="Permissions"]');

        const permissionsModalSearch = await permissionsModalIframe.getByPlaceholder('Search for');

        await permissionsModalSearch.click();
        await permissionsModalSearch.fill(roleName);

        await permissionsModalIframe.getByLabel('Search for', { exact: true }).click();

        await permissionsModalIframe.locator(`#${roleName}_ACTION_VIEW`).waitFor();
        await permissionsModalIframe.locator(`#${roleName}_ACTION_VIEW`).check();

        await permissionsModalIframe.getByRole('button', { name: 'Save' }).click();
    });

    await test.step('Do logout and login with the new user', async () => {
        await performLogout(page);
        await performLogin(page, userAccount.alternateName);
    });
    
    await test.step('Navigate to Data Set page', async () => {
        await dataSetsPage.goto();
    });

    await test.step('Check that the user have only "edit" option on actions menu', async () => {
        await page.locator('.dnd-td.item-actions').first().waitFor();

        await page
            .locator('.dnd-td.item-actions')
            .first()
            .locator('.dropdown-toggle')
            .click();

        const tableItemActions = await page
            .locator('.dropdown-menu')
            .filter({has: page.locator('span.pr-2')})
            .first()
            .locator('.dropdown-item')
            .allInnerTexts();

        await expect(tableItemActions).toEqual(['Edit']);
    });

    await test.step('Check that the user can now edit the data set', async () => {
        await dataSetsPage.goto();

        const dataSetRow = await page
            .locator('.data-set-content-wrapper .dnd-tbody .dnd-tr')
            .filter({hasText: dataSetLabel});

        await dataSetRow
            .first()
            .getByRole('button', {name: 'Actions'})
            .click();

        await page.getByRole('menuitem', {name: 'Edit'}).click();

        await expect(page.getByRole('heading', { name: 'Details' })).toBeVisible();
    });
});

