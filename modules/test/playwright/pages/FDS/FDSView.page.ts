/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {FDSPage} from './FDS.page';

import type {Page} from '@playwright/test';

export class FDSViewPage {
	page: Page;
	FDSPage: FDSPage;

	constructor(page: Page) {
		this.page = page;
		this.FDSPage = new FDSPage(page);
	}

	async goto() {
		await this.FDSPage.gotoTestDataSet();

		await this.page.getByRole('link', { name: /View Test/ }).first().click()
	}

	async createTestDataSetView() {
		await this.FDSPage.gotoTestDataSet();

		await this.page
			.getByRole('button', {
				name: /New Data Set View/,
			})
			.first()
			.click();

		await this.page.getByLabel('Name').fill('View Test');

		await this.page.getByRole('button', {name: /Save/}).first().click();
	}
}
