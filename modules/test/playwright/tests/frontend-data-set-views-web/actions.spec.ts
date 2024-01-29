/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {loginTest} from '../../fixtures/loginTest';
import {liferayConfig} from '../../liferay.config';
import {dataSetManagerPagesTest} from './fixtures/dataSetManagerPageTest';

export const test = mergeTests(dataSetManagerPagesTest, loginTest);

test('If no actions are created, show informative text', async ({
	actionsPage,
	page,
	viewsPage,
}) => {
	await viewsPage.goto();
	await actionsPage.goto();

	await expect(
		page.getByRole('tabpanel').getByText('No actions were created.')
	).toBeVisible();
});

test('Create a link action', async ({actionsPage, page, viewsPage}) => {
	await viewsPage.goto();
	await actionsPage.goto();

	await actionsPage.createTestDataSetAction({
		icon: 'arrow-right-full',
		name: 'Link action',
		type: 'link',
		url: liferayConfig.environment.baseUrl,
	});

	await expect(
		page
			.getByRole('cell', {exact: true, name: 'Link action'})
			.locator('span')
			.first()
	).toBeVisible();
});
