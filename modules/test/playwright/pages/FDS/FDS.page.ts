/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect} from '@playwright/test';

import {ApplicationsMenuPage} from '../product-navigation-applications-menu/applicationsMenu.page';

import type {Page} from '@playwright/test';

export class FDSPage {
	page: Page;
	applicationsMenuPage: ApplicationsMenuPage;

	constructor(page: Page) {
		this.page = page;
		this.applicationsMenuPage = new ApplicationsMenuPage(page);
	}

	async goto() {
		await this.applicationsMenuPage.goToFDS();
	}

	async createTestDataSet() {
		await this.goto();

		await this.page
			.getByRole('button', {
				name: /New Data Set/,
			})
			.first()
			.click();

		await this.page.getByLabel(/Name/).fill('Data Set Test');
		await this.page.getByLabel(/REST Application/).click();
		await this.page
			.getByRole('option', {name: '/data-set-manager/fields'})
			.click();

		await expect(this.page.getByLabel(/REST Schema/)).toBeVisible();

		await this.page.getByRole('button', {name: /Save/}).click();
	}

	async gotoTestDataSet() {
		await this.goto();

		await this.page
			.locator('.data-set-content-wrapper .dnd-tbody .dnd-tr')
			.filter({hasText: /Data Set Test/})
			.first()
			.getByRole('link')
			.click();
	}
}
