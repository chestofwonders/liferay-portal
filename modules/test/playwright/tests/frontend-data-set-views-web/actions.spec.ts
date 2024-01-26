/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {dataSetManagerPagesTest} from './fixtures/dataSetManagerPageTest';
import {loginTest} from '../../fixtures/loginTest';

export const test = mergeTests(dataSetManagerPagesTest, loginTest);

test('There are no item actions created in the Action tab', async ({
	actionsPage,
	viewsPage,
	page,
}) => {
	await viewsPage.goto();
	await actionsPage.goto();

	await expect(
		page.getByRole('tabpanel').getByText('No actions were created.')
	).toBeVisible();
});

test('The "New Creation Action" button is present', async ({
	actionsPage,
	viewsPage,
	page,
}) => {
	await viewsPage.goto();
	await actionsPage.goto();

	await expect(
		page.getByRole('button', {name: 'New Item Action'})
	).toBeVisible();
});

test('A new Link action is created', async ({
	actionsPage,
	viewsPage,
	page,
}) => {
	await viewsPage.goto();
	await actionsPage.goto();

	await actionsPage.createTestDataSetAction({
		icon: 'arrow-right-full',
		name: 'Link action',
		type: 'link',
		url: 'http://localhost:8080',
	});

	await expect(
		page
			.getByRole('cell', {exact: true, name: 'Link action'})
			.locator('span')
			.first()
	).toBeVisible();
});
