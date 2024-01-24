/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {test} from '@playwright/test';

import {DataSetManagerActionsPage} from '../pages/data-set-manager/DataSetManagerActionsPage';
import {DataSetManagerPage} from '../pages/data-set-manager/DataSetManagerPage';
import {DataSetManagerViewsPage} from '../pages/data-set-manager/DataSetManagerViewsPage';

const dataSetManagerPagesTest = test.extend<{
	dataSetManagerActionsPage: DataSetManagerActionsPage;
	dataSetManagerPage: DataSetManagerPage;
	dataSetManagerViewsPage: DataSetManagerViewsPage;
}>({
	dataSetManagerActionsPage: async ({page}, use) => {
		await use(new DataSetManagerActionsPage(page));
	},
	dataSetManagerPage: async ({page}, use) => {
		const dataSetManagerPage = new DataSetManagerPage(page);

		await dataSetManagerPage.goto();
		await dataSetManagerPage.createTestDataSetUI();
		await use(dataSetManagerPage);
		await dataSetManagerPage.deleteTestDataSetUI();
	},
	dataSetManagerViewsPage: async ({page}, use) => {
		const dataSetManagerViewsPage = new DataSetManagerViewsPage(page);

		await dataSetManagerViewsPage.goto();
		await dataSetManagerViewsPage.createTestDataSetView();
		await dataSetManagerViewsPage.gotoTestDataSetView();
		await use(dataSetManagerViewsPage);
	},
});

export {dataSetManagerPagesTest};
