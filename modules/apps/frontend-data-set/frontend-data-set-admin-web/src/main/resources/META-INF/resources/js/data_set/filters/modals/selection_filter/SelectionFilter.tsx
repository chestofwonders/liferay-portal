/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayAlert from '@clayui/alert';
import ClayForm, {
	ClayRadio,
	ClayRadioGroup,
	ClaySelectWithOption,
} from '@clayui/form';
import {TItem} from '@clayui/form/lib/SelectBox';
import ClayIcon from '@clayui/icon';
import ClayLayout from '@clayui/layout';
import ClayModal from '@clayui/modal';
import classNames from 'classnames';
import React, {useEffect, useState} from 'react';

import CheckboxMultiSelect from '../../../../components/CheckboxMultiSelect';
import RequiredMark from '../../../../components/RequiredMark';
import getAPISourceItems from '../../../../utils/getAPISourceItems';
import getAllPicklists from '../../../../utils/getAllPicklists';
import {
	ESelectionFilterSourceType,
	IField,
	IFilter,
	IPickList,
	ISelectionFilter,
} from '../../../../utils/types';
import Configuration from '../Configuration';
import Footer from '../Footer';
import ApiRestApplication from './source_type/ApiRestApplication';
import ObjectPicklist from './source_type/ObjectPicklist';

function Header() {
	return <>{Liferay.Language.get('new-selection-filter')}</>;
}

interface IBodyProps {
	closeModal: Function;
	fieldNames?: string[];
	fields: IField[];
	filter?: IFilter;
	namespace: string;
	onSave: Function;
	restApplications: string[];
}

function Body({
	closeModal,
	fieldNames,
	fields,
	filter,
	namespace,
	onSave,
	restApplications,
}: IBodyProps) {
	const [fieldInUseValidationError, setFieldInUseValidationError] =
		useState<boolean>(false);
	const [fieldValidationError, setFieldValidationError] =
		useState<boolean>(false);
	const [labelValidationError, setLabelValidationError] =
		useState<boolean>(false);
	const [sourceValidationError, setSourceValidationError] =
		useState<boolean>(false);
	const [sourceTypeValidationError, setSourceTypeValidationError] =
		useState<boolean>(false);

	const [
		noPicklistsAvailableValidationError,
		setNoPicklistsAvailableValidationError,
	] = useState(false);
	const [
		requiredRESTApplicationValidationError,
		setRequiredRESTApplicationValidationError,
	] = useState(false);
	const [restSchemaValidationError, setRESTSchemaValidationError] =
		useState(false);
	const [restEndpointValidationError, setRESTEndpointValidationError] =
		useState(false);

	const [filteredSourceItems, setFilteredSourceItems] = useState<TItem[]>([]);
	const [preselectedValueInput, setPreselectedValueInput] = useState('');
	const [saveButtonDisabled, setSaveButtonDisabled] =
		useState<boolean>(false);
	const [includeMode, setIncludeMode] = useState<string>('include');
	const inUseFields: (string | undefined)[] = fields.map((item) =>
		fieldNames?.includes(item.name) ? item.name : undefined
	);
	const [multiple, setMultiple] = useState<boolean>(
		(filter as ISelectionFilter)?.multiple ?? true
	);
	const [preselectedValues, setPreselectedValues] = useState<any[]>([]);
	const [selectedField, setSelectedField] = useState<IField | undefined>(
		fields.find((item) => item.name === filter?.fieldName)
	);
	const [source, setSource] = useState<IPickList | string | undefined>();
	const [sourceType, setSourceType] = useState<
		ESelectionFilterSourceType | undefined
	>();
	const fdsFilterLabelTranslations = filter?.label_i18n ?? {};
	const [i18nFilterLabels, setI18nFilterLabels] = useState(
		fdsFilterLabelTranslations
	);
	const [selectedRESTApplication, setSelectedRESTApplication] = useState<
		string | null
	>('');
	const [selectedRESTSchema, setSelectedRESTSchema] = useState<string | null>(
		''
	);
	const [selectedRESTEndpoint, setSelectedRESTEndpoint] = useState<
		string | null
	>('');
	const [selectedItemKey, setSelectedItemKey] = useState<string>('');
	const [selectedItemLabel, setSelectedItemLabel] = useState<string>('');
	const [itemKeyValidationError, setItemKeyValidationError] =
		useState<boolean>(false);
	const [itemLabelValidationError, setItemLabelValidationError] =
		useState<boolean>(false);

	const includeModeFormElementId = `${namespace}IncludeMode`;
	const multipleFormElementId = `${namespace}Multiple`;
	const sourceOptionFormElementId = `${namespace}SourceOption`;
	const preselectedValuesFormElementId = `${namespace}PreselectedValues`;

	const isValidSingleMode =
		multiple || (!multiple && !(preselectedValues.length > 1));

	const isi18nFilterLabelsValid = (
		i18nFilterLabels: Partial<Liferay.Language.FullyLocalizedValue<string>>
	) => {
		let isValid = true;

		if (!i18nFilterLabels || !Object.values(i18nFilterLabels).length) {
			isValid = false;
		}

		Object.values(i18nFilterLabels).forEach((value) => {
			if (!value) {
				isValid = false;
			}
		});

		return isValid;
	};

	const validate = () => {
		let isValid = true;

		const isLabelValid = isi18nFilterLabelsValid(i18nFilterLabels);
		setLabelValidationError(!isLabelValid);

		isValid = isLabelValid;

		if (!selectedField) {
			setFieldValidationError(true);

			isValid = false;
		}

		if (selectedField && !filter) {
			if (inUseFields.includes(selectedField?.name)) {
				setFieldInUseValidationError(true);

				isValid = false;
			}
		}

		if (!sourceType) {
			setSourceTypeValidationError(true);

			isValid = false;
		}

		if (!source) {
			setSourceValidationError(true);

			isValid = false;
		}

		if (
			sourceType &&
			sourceType === ESelectionFilterSourceType.API_HEADLESS
		) {
			if (!selectedItemKey) {
				setItemKeyValidationError(true);

				isValid = false;
			}

			if (!selectedItemLabel) {
				setItemLabelValidationError(true);

				isValid = false;
			}

			if (!selectedRESTApplication) {
				setRequiredRESTApplicationValidationError(true);

				isValid = false;
			}

			if (!selectedRESTSchema) {
				setRESTSchemaValidationError(true);

				isValid = false;
			}

			if (!selectedRESTEndpoint) {
				setRESTEndpointValidationError(true);

				isValid = false;
			}
		}

		return isValid;
	};

	const saveSelectionFilter = () => {
		setSaveButtonDisabled(true);

		const success = validate();

		if (success) {
			let formData: any = {
				fieldName: selectedField?.name,
				label_i18n: i18nFilterLabels,
			};

			if (sourceType === ESelectionFilterSourceType.API_HEADLESS) {
				formData = {
					...formData,
					itemKey: selectedItemKey,
					itemLabel: selectedItemLabel,
					preselectedValues: JSON.stringify(
						preselectedValues.map((item: any) => ({
							label: item.label,
							value: item.value,
						}))
					),
					restApplication: selectedRESTApplication,
					restEndpoint: selectedRESTEndpoint,
					restSchema: selectedRESTSchema,
					source: source as string,
					sourceType,
				};
			}

			if (sourceType === ESelectionFilterSourceType.PICKLIST) {
				formData = {
					...formData,
					preselectedValues: JSON.stringify(
						preselectedValues.map(
							(item: any) => item.externalReferenceCode
						)
					),
					source: (source as IPickList)?.externalReferenceCode,
					sourceType,
				};
			}

			formData = {
				...formData,
				include: includeMode === 'include',
				multiple,
			};

			onSave(formData);
		}
		else {
			setSaveButtonDisabled(false);
		}
	};

	function getAPIHeadlessSourceURL(
		restApplication: string | null,
		restEndpoint: string | null
	): string | null {
		if (!restApplication || !restEndpoint) {
			return null;
		}

		return `/o${restApplication.replace('v1.0/', '')}${restEndpoint}`;
	}

	useEffect(() => {
		if (!filter) {
			return;
		}

		const selectionFilter = filter as ISelectionFilter;

		if (
			selectionFilter.sourceType ===
			ESelectionFilterSourceType.API_HEADLESS
		) {
			const selectionFilter = filter as ISelectionFilter;

			setSelectedRESTApplication(selectionFilter.restApplication);
			setSelectedRESTSchema(selectionFilter.restSchema);
			setSelectedRESTEndpoint(selectionFilter.restEndpoint);

			setSelectedItemKey(selectionFilter.itemKey);
			setSelectedItemLabel(selectionFilter.itemLabel);

			setSource(selectionFilter.source);
			setSourceType(selectionFilter.sourceType);

			getAPISourceItems({
				preselectedValueInput: '',
				selectedItemKey: selectionFilter.itemKey,
				selectedItemLabel: selectionFilter.itemLabel,
				source: selectionFilter.source,
			}).then((sourceItems) => {
				const filterPreselectedValues = JSON.parse(
					selectionFilter.preselectedValues || '[]'
				);
				let validSavedPreselectedValues: any[] = [];

				validSavedPreselectedValues = sourceItems.filter(
					(item: {label: string; value: string}) =>
						filterPreselectedValues.find(
							(filterValue: {label: string; value: string}) =>
								filterValue.value === item.value
						)
				);

				setPreselectedValues(validSavedPreselectedValues);
				setIncludeMode(
					validSavedPreselectedValues?.length
						? filter && selectionFilter.include
							? 'include'
							: 'exclude'
						: 'include'
				);
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!filter) {
			return;
		}

		const selectionFilter = filter as ISelectionFilter;

		if (
			selectionFilter.sourceType === ESelectionFilterSourceType.PICKLIST
		) {
			getAllPicklists().then((items) => {
				if (!items.length) {
					setNoPicklistsAvailableValidationError(true);
				}
				else {
					setNoPicklistsAvailableValidationError(false);
					setSourceType(selectionFilter.sourceType);

					const picklist = items.find(
						(item) =>
							String(item.externalReferenceCode) ===
							selectionFilter?.source
					);

					if (picklist) {
						setSource(picklist);

						let validSavedPreselectedValues: any[] = [];

						validSavedPreselectedValues =
							picklist.listTypeEntries.filter((item) =>
								JSON.parse(
									selectionFilter.preselectedValues || '[]'
								).includes(item.externalReferenceCode)
							);

						const sourceItems = picklist.listTypeEntries.map(
							(item) => ({
								label: item.name,
								value: item.externalReferenceCode,
							})
						);

						setFilteredSourceItems(sourceItems);
						setPreselectedValues(validSavedPreselectedValues);
						setIncludeMode(
							validSavedPreselectedValues?.length
								? filter && selectionFilter.include
									? 'include'
									: 'exclude'
								: 'include'
						);
					}
				}
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (noPicklistsAvailableValidationError) {
		return (
			<ClayAlert displayType="info" title="Info">
				{Liferay.Language.get(
					'no-filter-sources-are-available.-create-a-picklist-or-a-vocabulary-for-this-type-of-filter'
				)}
			</ClayAlert>
		);
	}

	return (
		<>
			<ClayModal.Body>
				<Configuration
					fieldInUseValidationError={fieldInUseValidationError}
					fieldNames={fieldNames}
					fieldValidationError={fieldValidationError}
					fields={fields}
					filter={filter}
					labelValidationError={labelValidationError}
					namespace={namespace}
					onBlur={() => {
						setLabelValidationError(
							!isi18nFilterLabelsValid(i18nFilterLabels)
						);
					}}
					onChangeField={(newValue) => {
						setSelectedField(newValue);
						setFieldValidationError(!newValue);
						setFieldInUseValidationError(
							newValue
								? inUseFields.includes(newValue.name)
								: false
						);
					}}
					onChangeLabel={(newValue) => {
						setI18nFilterLabels(newValue);
					}}
				/>

				{!fieldInUseValidationError && (
					<>
						<ClayLayout.SheetSection className="mb-4">
							<h3 className="sheet-subtitle">
								{Liferay.Language.get('filter-source')}
							</h3>

							<ClayForm.Text>
								{Liferay.Language.get(
									'the-filter-source-determines-the-values-to-be-offered-in-this-filter-to-the-user'
								)}
							</ClayForm.Text>
						</ClayLayout.SheetSection>

						<ClayForm.Group
							className={classNames({
								'has-error': sourceTypeValidationError,
							})}
						>
							<label htmlFor={sourceOptionFormElementId}>
								{Liferay.Language.get('source')}

								<RequiredMark />
							</label>

							<ClaySelectWithOption
								aria-label={Liferay.Language.get(
									'choose-an-option'
								)}
								disabled={!!filter}
								id={sourceOptionFormElementId}
								name={sourceOptionFormElementId}
								onChange={(event) => {
									const newSourceType = event.target
										.value as ESelectionFilterSourceType;

									setSourceType(newSourceType);

									if (
										newSourceType ===
										ESelectionFilterSourceType.PICKLIST
									) {
										getAllPicklists().then((items) => {
											if (!items.length) {
												setNoPicklistsAvailableValidationError(
													true
												);
											}
											else {
												setNoPicklistsAvailableValidationError(
													false
												);
											}
										});
									}

									setSourceTypeValidationError(false);

									setSource(undefined);
									setPreselectedValueInput('');

									setPreselectedValues([]);
								}}
								options={[
									{
										disabled: true,
										label: Liferay.Language.get(
											'choose-an-option'
										),
										value: '',
									},
									{
										disabled: false,
										label: Liferay.Language.get(
											'api-rest-application'
										),
										value: ESelectionFilterSourceType.API_HEADLESS,
									},
									{
										disabled: false,
										label: Liferay.Language.get(
											'object-picklist'
										),
										value: ESelectionFilterSourceType.PICKLIST,
									},
								]}
								required
								title={Liferay.Language.get('source')}
								value={sourceType || ''}
							/>

							{sourceTypeValidationError && (
								<ClayForm.FeedbackGroup>
									<ClayForm.FeedbackItem>
										<ClayForm.FeedbackIndicator symbol="exclamation-full" />

										{Liferay.Language.get(
											'this-field-is-required'
										)}
									</ClayForm.FeedbackItem>
								</ClayForm.FeedbackGroup>
							)}
						</ClayForm.Group>

						{sourceType &&
							sourceType ===
								ESelectionFilterSourceType.PICKLIST && (
								<ObjectPicklist
									filter={filter}
									namespace={namespace}
									onChange={({picklist, sourceItems}) => {
										setSource(picklist);
										setSourceValidationError(false);
										setFilteredSourceItems(sourceItems);
										setPreselectedValues([]);
									}}
									preselectedValueInput={
										preselectedValueInput
									}
									sourceValidationError={
										sourceValidationError
									}
								/>
							)}

						{sourceType &&
							sourceType ===
								ESelectionFilterSourceType.API_HEADLESS && (
								<ApiRestApplication
									filter={filter as ISelectionFilter}
									itemKeyValidationError={
										itemKeyValidationError
									}
									itemLabelValidationError={
										itemLabelValidationError
									}
									namespace={namespace}
									onChange={({
										selectedItemKey,
										selectedItemLabel,
										selectedRESTApplication,
										selectedRESTEndpoint,
										selectedRESTSchema,
										sourceItems,
									}) => {
										setSelectedRESTApplication(
											selectedRESTApplication
										);
										if (selectedRESTApplication) {
											setRequiredRESTApplicationValidationError(
												false
											);
										}

										setSelectedRESTEndpoint(
											selectedRESTEndpoint
										);
										if (selectedRESTEndpoint) {
											setRESTEndpointValidationError(
												false
											);
										}

										const source = getAPIHeadlessSourceURL(
											selectedRESTApplication!.replace(
												'/v1.0',
												''
											),
											selectedRESTEndpoint
										);

										setSource(source as string);
										setSourceValidationError(false);

										setSelectedRESTSchema(
											selectedRESTSchema
										);
										if (selectedRESTSchema) {
											setRESTSchemaValidationError(false);
										}

										setSelectedItemKey(selectedItemKey);
										setItemKeyValidationError(false);

										setSelectedItemLabel(selectedItemLabel);
										setItemLabelValidationError(false);

										setFilteredSourceItems(sourceItems);
									}}
									preselectedValueInput={
										preselectedValueInput
									}
									requiredRESTApplicationValidationError={
										requiredRESTApplicationValidationError
									}
									restApplications={restApplications}
									restEndpointValidationError={
										restEndpointValidationError
									}
									restSchemaValidationError={
										restSchemaValidationError
									}
									source={source as string}
								/>
							)}

						{source && (
							<>
								<ClayLayout.SheetSection className="mb-4">
									<h3 className="sheet-subtitle">
										{Liferay.Language.get('filter-options')}
									</h3>
								</ClayLayout.SheetSection>
								<ClayForm.Group
									className={classNames({
										'has-error': !isValidSingleMode,
									})}
								>
									<label
										htmlFor={preselectedValuesFormElementId}
									>
										{Liferay.Language.get(
											'preselected-values'
										)}

										<span
											className="label-icon lfr-portal-tooltip ml-2"
											title={Liferay.Language.get(
												'choose-values-to-preselect-for-your-filters-source-option'
											)}
										>
											<ClayIcon symbol="question-circle-full" />
										</span>
									</label>

									<CheckboxMultiSelect
										allowsCustomLabel={false}
										aria-label={Liferay.Language.get(
											'preselected-values'
										)}
										inputName={
											preselectedValuesFormElementId
										}
										items={preselectedValues.map((item) => {
											let valueItem;

											if (
												sourceType ===
												ESelectionFilterSourceType.PICKLIST
											) {
												valueItem = {
													label: item.name,
													value: String(
														item.externalReferenceCode
													),
												};
											}

											if (
												sourceType ===
												ESelectionFilterSourceType.API_HEADLESS
											) {
												valueItem = {
													label: item.label,
													value: item.value,
												};
											}

											return valueItem as TItem;
										})}
										loadingState={4}
										onChange={setPreselectedValueInput}
										onItemsChange={(selectedItems: any) => {
											let preselectedValues;

											if (
												sourceType ===
												ESelectionFilterSourceType.API_HEADLESS
											) {
												preselectedValues =
													selectedItems.map(
														({value}: any) => {
															return filteredSourceItems.find(
																(item) =>
																	String(
																		item.value
																	) ===
																	String(
																		value
																	)
															);
														}
													);
											}

											if (
												sourceType ===
												ESelectionFilterSourceType.PICKLIST
											) {
												preselectedValues =
													selectedItems.map(
														({value}: any) => {
															return (
																source as IPickList
															).listTypeEntries.find(
																(item) =>
																	String(
																		item.externalReferenceCode
																	) ===
																	String(
																		value
																	)
															);
														}
													);
											}

											setPreselectedValues(
												preselectedValues
											);

											setIncludeMode(
												preselectedValues.length
													? filter &&
														(
															filter as ISelectionFilter
														).include
														? 'include'
														: 'exclude'
													: 'include'
											);
										}}
										placeholder={Liferay.Language.get(
											'select-a-default-value-for-your-filter'
										)}
										sourceItems={filteredSourceItems}
										value={preselectedValueInput}
									/>

									{!isValidSingleMode && (
										<ClayForm.FeedbackGroup>
											<ClayForm.FeedbackItem>
												<ClayForm.FeedbackIndicator symbol="exclamation-full" />

												{Liferay.Language.get(
													'only-one-value-is-allowed-in-single-selection-mode'
												)}
											</ClayForm.FeedbackItem>
										</ClayForm.FeedbackGroup>
									)}
								</ClayForm.Group>

								<ClayLayout.Row justify="start">
									<ClayLayout.Col size={6}>
										<ClayForm.Group>
											<label
												htmlFor={multipleFormElementId}
											>
												{Liferay.Language.get(
													'selection'
												)}

												<span
													className="label-icon lfr-portal-tooltip ml-2"
													title={Liferay.Language.get(
														'determines-how-many-preselected-values-for-the-filter-can-be-added'
													)}
												>
													<ClayIcon symbol="question-circle-full" />
												</span>
											</label>

											<ClayRadioGroup
												name={multipleFormElementId}
												onChange={(newVal: any) => {
													const newMultiple =
														newVal === 'true';
													setMultiple(newMultiple);
												}}
												value={
													multiple ? 'true' : 'false'
												}
											>
												<ClayRadio
													label={Liferay.Language.get(
														'multiple'
													)}
													value="true"
												/>

												<ClayRadio
													label={Liferay.Language.get(
														'single'
													)}
													value="false"
												/>
											</ClayRadioGroup>
										</ClayForm.Group>
									</ClayLayout.Col>

									{preselectedValues?.length > 0 && (
										<ClayLayout.Col size={6}>
											<ClayForm.Group>
												<label
													htmlFor={
														includeModeFormElementId
													}
												>
													{Liferay.Language.get(
														'filter-mode'
													)}

													<span
														className="label-icon lfr-portal-tooltip ml-2"
														title={Liferay.Language.get(
															'include-returns-only-the-selected-values.-exclude-returns-all-except-the-selected-ones'
														)}
													>
														<ClayIcon symbol="question-circle-full" />
													</span>
												</label>

												<ClayRadioGroup
													name={
														includeModeFormElementId
													}
													onChange={(val: any) => {
														setIncludeMode(val);
													}}
													value={includeMode}
												>
													<ClayRadio
														label={Liferay.Language.get(
															'include'
														)}
														value="include"
													/>

													<ClayRadio
														label={Liferay.Language.get(
															'exclude'
														)}
														value="exclude"
													/>
												</ClayRadioGroup>
											</ClayForm.Group>
										</ClayLayout.Col>
									)}
								</ClayLayout.Row>
							</>
						)}
					</>
				)}
			</ClayModal.Body>

			<Footer
				closeModal={closeModal}
				onSave={saveSelectionFilter}
				saveButtonDisabled={saveButtonDisabled}
			/>
		</>
	);
}

export default {
	Body,
	Header,
};
