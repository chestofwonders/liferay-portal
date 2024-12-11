/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ObjectDefinitionApi} from '@liferay/object-admin-rest-client-js';
import {expect, mergeTests} from '@playwright/test';

import {apiHelpersTest} from '../../../../fixtures/apiHelpersTest';
import {featureFlagsTest} from '../../../../fixtures/featureFlagsTest';
import {isolatedSiteTest} from '../../../../fixtures/isolatedSiteTest';
import {loginTest} from '../../../../fixtures/loginTest';
import getRandomString from '../../../../utils/getRandomString';
import getFormContainerDefinition from '../../../layout-content-page-editor-web/utils/getFormContainerDefinition';
import getFragmentDefinition from '../../../layout-content-page-editor-web/utils/getFragmentDefinition';
import getPageDefinition from '../../../layout-content-page-editor-web/utils/getPageDefinition';
import {getObjectERC} from '../../../setup/page-management-site/utils/getObjectERC';

const test = mergeTests(
	apiHelpersTest,
	featureFlagsTest({
		'LPS-178052': {enabled: true},
	}),
	isolatedSiteTest,
	loginTest()
);

const fragmentSetName = getRandomString();
const fragmentName = getRandomString();
let layout: Layout;

test(
	'Logo Selector can be rendered in a fragment',
	{tag: '@LPD-43308'},
	async ({apiHelpers, page, site}) => {
		await test.step('Create a new fragment collection with custom basic fragment', async () => {
			const {fragmentCollectionId} =
				await apiHelpers.jsonWebServicesFragmentCollection.addFragmentCollection(
					{
						groupId: site.id,
						name: fragmentSetName,
					}
				);

			await apiHelpers.jsonWebServicesFragmentEntry.addFragmentEntry({
				fragmentCollectionId,
				groupId: site.id,
				html: '<div class="fragment-name">[@liferay_frontend["logo-selector"] currentLogoURL="/image/user_female_portrait.png" defaultLogoURL="/image/user_female_portrait.png"/]</div>',
				name: fragmentName,
			});
		});

		await test.step('Add fragment to page', async () => {
			const basicFragmentDefinition = getFragmentDefinition({
				id: getRandomString(),
				key: fragmentName,
			});

			const objectDefinitionApiClient =
				await apiHelpers.buildRestClient(ObjectDefinitionApi);

			const {className: objectDefinitionClassName} = (
				await objectDefinitionApiClient.getObjectDefinitionByExternalReferenceCode(
					getObjectERC('Potato')
				)
			).body;

			const formDefinition = getFormContainerDefinition({
				id: getRandomString(),
				objectDefinitionClassName,
				pageElements: [basicFragmentDefinition],
			});

			const layoutTitle = getRandomString();

			layout = await apiHelpers.headlessDelivery.createSitePage({
				pageDefinition: getPageDefinition([
					basicFragmentDefinition,
					formDefinition,
				]),
				siteId: site.id,
				title: layoutTitle,
			});
		});

		await test.step('Assert that logo selector is available on the page', async () => {
			await page.goto(`/web/guest${layout.friendlyURL}`);

			const logoSelector = await page.getByRole('img', {
				name: 'Current Logo',
			});

			await expect(logoSelector).toBeVisible();
		});
	}
);
