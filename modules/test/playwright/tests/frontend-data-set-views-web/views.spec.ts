/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {dataSetManagerPagesTest} from './fixtures/dataSetManagerPageTest';
import {loginTest} from '../../fixtures/loginTest';

export const test = mergeTests(dataSetManagerPagesTest, loginTest);

test('View Test is created', async ({
	dataSetManagerPage,
	dataSetManagerViewsPage,
	page,
}) => {
	await dataSetManagerPage.goto();
	await dataSetManagerViewsPage.goto();

	await expect(
		page.getByRole('link', {name: 'Data Set View Test'})
	).toBeVisible();
});
