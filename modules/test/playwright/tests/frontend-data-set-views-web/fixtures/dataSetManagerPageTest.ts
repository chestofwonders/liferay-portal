/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {test} from '@playwright/test';

import {ActionsPage} from '../pages/ActionsPage';
import {DataSetPage} from '../pages/DataSetPage';
import {ViewsPage} from '../pages/ViewsPage';

const dataSetManagerPagesTest = test.extend<{
	actionsPage: ActionsPage;
	dataSetsPage: DataSetPage;
	viewsPage: ViewsPage;
}>({
	actionsPage: async ({page}, use) => {
		await use(new ActionsPage(page));
	},
	dataSetsPage: async ({page}, use) => {
		const dataSetsPage = new DataSetPage(page);

		await dataSetsPage.goto();
		await dataSetsPage.createTestDataSetUI();
		await use(dataSetsPage);
		await dataSetsPage.deleteTestDataSetUI();
	},
	viewsPage: async ({page}, use) => {
		const viewsPage = new ViewsPage(page);

		await viewsPage.goto();
		await viewsPage.createTestDataSetView();
		await viewsPage.gotoTestDataSetView();
		await use(viewsPage);
	},
});

export {dataSetManagerPagesTest};
