/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {DataSetManagerPage} from './DataSetManagerPage';

import type {Locator, Page} from '@playwright/test';

export class DataSetManagerViewsPage {
	readonly dataSetManagerPage: DataSetManagerPage;
	readonly dataSetsViewTable: Locator;
	readonly newDataSetViewButton: Locator;
	readonly newDataSetViewEmptyButton: Locator;
	readonly newDataSetViewModal: {
		name: Locator;
		saveButton: Locator;
	};
	readonly page: Page;

	constructor(page: Page) {
		this.dataSetManagerPage = new DataSetManagerPage(page);
		this.dataSetsViewTable = page.getByText(
			'ViewsData Set View TestActions'
		);
		this.newDataSetViewButton = page.getByLabel('New Data Set View');
		this.newDataSetViewEmptyButton = page.getByText('New Data Set View');
		this.newDataSetViewModal = {
			name: page.getByLabel('NameRequired'),
			saveButton: page.getByRole('button', {name: 'Save'}),
		};
		this.page = page;
	}

	async goto() {
		await this.dataSetManagerPage.goto();
		await this.dataSetManagerPage.gotoTestDataSet();
	}

	async createTestDataSetView() {
		await this.newDataSetViewButton.click();

		await this.newDataSetViewModal.name.fill('Data Set View Test');

		await this.newDataSetViewModal.saveButton.click();
	}

	async gotoTestDataSetView() {
		await this.dataSetsViewTable
			.getByRole('link', {name: 'Data Set View Test'})
			.first()
			.click();
	}
}
