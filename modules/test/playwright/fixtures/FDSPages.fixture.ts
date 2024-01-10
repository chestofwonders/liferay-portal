/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {test} from '@playwright/test';

import {FDSPage} from '../pages/FDS/FDS.page';
import {FDSViewPage} from '../pages/FDS/FDSView.page';
import {FDSActionsPage} from '../pages/FDS/FDSActions.page';

const FDSPagesTest = test.extend<{
	_FDSPage: FDSPage;
	_FDSViewPage: FDSViewPage;
	_FDSActionsPage: FDSActionsPage;
}>({
	_FDSPage: async ({page}, use) => {
		await use(new FDSPage(page));
	},
	_FDSViewPage: async ({page}, use) => {
		await use(new FDSViewPage(page));
	},
	_FDSActionsPage: async ({page}, use) => {
		await use(new FDSActionsPage(page));
	},
});

export {FDSPagesTest};
