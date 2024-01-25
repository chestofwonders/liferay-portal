/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {test} from '@playwright/test';

import {ActionsPage} from '../pages/ActionsPage';
import {DataSetPage} from '../pages/DataSetPage';
import {ViewsPage} from '../pages/ViewsPage';

const dataSetManagerPagesTest = test.extend<{
	dataSetManagerActionsPage: ActionsPage;
	dataSetManagerPage: DataSetPage;
	dataSetManagerViewsPage: ViewsPage;
}>({
	dataSetManagerActionsPage: async ({page}, use) => {
		await use(new ActionsPage(page));
	},
	dataSetManagerPage: async ({page}, use) => {
		const dataSetManagerPage = new DataSetPage(page);

		await dataSetManagerPage.goto();
		await dataSetManagerPage.createTestDataSetUI();
		await use(dataSetManagerPage);
		await dataSetManagerPage.deleteTestDataSetUI();
	},
	dataSetManagerViewsPage: async ({page}, use) => {
		const dataSetManagerViewsPage = new ViewsPage(page);

		await dataSetManagerViewsPage.goto();
		await dataSetManagerViewsPage.createTestDataSetView();
		await dataSetManagerViewsPage.gotoTestDataSetView();
		await use(dataSetManagerViewsPage);
	},
});

export {dataSetManagerPagesTest};
