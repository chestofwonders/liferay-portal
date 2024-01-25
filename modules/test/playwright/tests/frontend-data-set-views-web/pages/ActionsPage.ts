/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import { ActionTypes } from '../utils/types';
import {ViewsPage} from './ViewsPage';

import type {Locator, Page} from '@playwright/test';

export class ActionsPage {
	readonly viewsPage: ViewsPage;
	readonly newActionButton: Locator;
	readonly newItemActionForm: {
		addIconButton: Locator;
		name: Locator;
		saveButton: Locator;
		selectIconModal: {
			iconsList: Locator;
			search: Locator;
		};
		type: Locator;
		url: Locator;
	};
	readonly page: Page;

	constructor(page: Page) {
		this.viewsPage = new ViewsPage(page);
		this.newActionButton = page.getByRole('button', {name: /Add Action/});
		this.newItemActionForm = {
			addIconButton: page.getByLabel('add-icon'),
			name: page.getByPlaceholder('Action Name'),
			saveButton: page.getByRole('button', {name: /Save/}),
			selectIconModal: {
				iconsList: page.locator('li'),
				search: page.getByPlaceholder('Search'),
			},
			type: page.getByLabel('TypeRequired', {exact: true}),
			url: page.getByPlaceholder('Add a URL here.'),
		};
		this.page = page;
	}

	async goto() {
		await this.viewsPage.goto();
		await this.viewsPage.gotoTestDataSetView();

		this.page
			.getByRole('button', {name: /Actions/})
			.first()
			.click();
	}

	async createTestDataSetAction({
		icon,
		name,
		type,
		url,
	}: {
		icon: string;
		name: string;
		type: ActionTypes;
		url: string;
	}) {
		await this.newActionButton.click();

		await this.newItemActionForm.name.fill(name);
		await this.newItemActionForm.addIconButton.click();

		await this.newItemActionForm.selectIconModal.search.fill(icon);
		await this.newItemActionForm.selectIconModal.iconsList
			.filter({hasText: icon})
			.click();

		await this.newItemActionForm.type.selectOption(type);

		if (type === 'modal' || type === 'sidePanel') {
			await this.page.getByPlaceholder(/add-here-the-title/).click();
			await this.page
				.getByPlaceholder(/add-here-the-title/)
				.fill(`${name} Title`);
		}

		await this.newItemActionForm.url.fill(url);
		await this.newItemActionForm.saveButton.click();
	}
}
