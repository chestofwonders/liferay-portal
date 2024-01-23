/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {apiHelpersTest} from '../../fixtures/apiHelpersTest';
import {dataSetManagerPagesTest} from '../../fixtures/dataSetManagerPageTest';

export const test = mergeTests(apiHelpersTest, dataSetManagerPagesTest);

test('Data Set Test is created', async ({dataSetManagerPage, page}) => {
	await dataSetManagerPage.goto();

	await expect(
		page.getByRole('link', {name: 'Data Set Test'}).first()
	).toBeVisible();
});

test('View Test is created', async ({dataSetManagerViewsPage, page}) => {
	await dataSetManagerViewsPage.goto();

	await dataSetManagerViewsPage.createTestDataSetView();

	await expect(
		page.getByRole('link', {name: 'Data Set View Test'})
	).toBeVisible();
});

test('There are no item actions created in the Action tab', async ({
	dataSetManagerActionsPage,
	page,
}) => {
	await dataSetManagerActionsPage.goto();

	await expect(
		page.getByRole('tabpanel').getByText('No actions were created.')
	).toBeVisible();
});

test('The "New Creation Action" button is present', async ({
	dataSetManagerActionsPage,
	page,
}) => {
	await dataSetManagerActionsPage.goto();

	await expect(
		page.getByRole('button', {name: 'New Item Action'})
	).toBeVisible();
});

test('A new Link action is created', async ({
	dataSetManagerActionsPage,
	page,
}) => {
	await dataSetManagerActionsPage.goto();

	await dataSetManagerActionsPage.createTestDataSetAction({
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

test('A new Modal action is created', async ({
	dataSetManagerActionsPage,
	page,
}) => {
	await dataSetManagerActionsPage.goto();

	await dataSetManagerActionsPage.createTestDataSetAction({
		icon: 'arrow-right-full',
		name: 'Modal action',
		type: 'modal',
		url: 'http://localhost:8080',
	});

	await expect(
		page
			.getByRole('cell', {exact: true, name: 'Modal action'})
			.locator('span')
			.first()
	).toBeVisible();
});

test('A new Side Panel action is created', async ({
	dataSetManagerActionsPage,
	page,
}) => {
	await dataSetManagerActionsPage.goto();

	await dataSetManagerActionsPage.createTestDataSetAction({
		icon: 'arrow-right-full',
		name: 'Side panel action',
		type: 'sidePanel',
		url: 'http://localhost:8080',
	});

	await expect(
		page
			.getByRole('cell', {exact: true, name: 'Side panel action'})
			.locator('span')
			.first()
	).toBeVisible();
});
