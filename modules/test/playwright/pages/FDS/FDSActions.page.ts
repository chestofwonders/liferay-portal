/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import type {Page} from '@playwright/test';

import {FDSViewPage} from './FDSView.page';

export type ModalTypes = 'modal' | 'link' | 'sidePanel';

export class FDSActionsPage {
	page: Page;
	FDSViewPage: FDSViewPage;

	constructor(page: Page) {
		this.page = page;
		this.FDSViewPage = new FDSViewPage(page);
	}

	async goto() {
		await this.FDSViewPage.goto();

		this.page.getByRole('button', { name: /Actions/ }).first().click()
	}

	async create({name, type, url, icon}: {name: string, type: ModalTypes, url: string, icon: string}) {
		await this.page.getByRole('button', { name: /Add Action/ }).click();
        await this.page.getByPlaceholder(/Action Name/).click();
        await this.page.getByPlaceholder(/Action Name/).fill(name);
        await this.page.getByLabel(/add-icon/).click();
        await this.page.getByPlaceholder(/Search/).click();
        await this.page.getByPlaceholder(/Search/).fill(icon);
		await this.page.getByText(icon, { exact: true }).click();
        await this.page.getByLabel('TypeRequired', { exact: true }).selectOption(type);

		if( type == 'modal' || type == 'sidePanel' ){
			await this.page.getByPlaceholder(/add-here-the-title/).click();
			await this.page.getByPlaceholder(/add-here-the-title/).fill(`${name} Title`);
		}

        await this.page.getByPlaceholder(/Add a URL here./).click();
        await this.page.getByPlaceholder(/Add a URL here./).fill(url);
        await this.page.getByRole('button', { name: /Save/ }).click();
	}
}
