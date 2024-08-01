/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {fetch} from 'frontend-js-web';
import fuzzy from 'fuzzy';

export default async function getAPISourceItems({
	preselectedValueInput,
	selectedItemKey,
	selectedItemLabel,
	source,
}: {
	preselectedValueInput: string;
	selectedItemKey: string;
	selectedItemLabel: string;
	source: string | null;
}) {
	const isValidSource =
		source && !(source as string).match(/\{[A-Za-z0-9]+\}/g);

	if (!isValidSource || !selectedItemKey || !selectedItemLabel) {
		return [];
	}

	const sourceItems = await fetch(source as string)
		.then((response) => {
			if (!response.ok) {
				return [];
			}

			const responseJSON = response.json();

			return responseJSON;
		})
		.then((apiValues) => {
			return !apiValues.items.length
				? []
				: apiValues.items
						.filter((item: any) => {
							return fuzzy.match(
								preselectedValueInput,
								String(item[selectedItemLabel])
							);
						})
						.map((item: any) => {
							return {
								label: String(item[selectedItemLabel]),
								value: String(item[selectedItemKey]),
							};
						});
		});

	return sourceItems;
}
