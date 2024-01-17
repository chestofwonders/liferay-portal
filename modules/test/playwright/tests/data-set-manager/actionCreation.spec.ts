import {expect, mergeTests} from '@playwright/test';

import {dataSetManagerPagesTest} from '../../fixtures/dataSetManagerPageTest';
import {apiHelpersTest} from '../../fixtures/apiHelpers.fixture';

export const test = mergeTests(
    apiHelpersTest,
	dataSetManagerPagesTest
);

test('Data Set Test is created', async ({page, dataSetManagerPage}) => {
    await dataSetManagerPage.goto();

    await expect(
        page.getByRole('link', { name: 'Data Set Test'}).first()
    ).toBeVisible();
});

test('View Test is created', async ({page, dataSetManagerViewsPage}) => {
    await dataSetManagerViewsPage.goto();

    await dataSetManagerViewsPage.createTestDataSetView();

    await expect( 
        page.getByRole('link', {name: 'Data Set View Test'})
    ).toBeVisible();
});


test('There are no item actions created in the Action tab', async ({page, dataSetManagerActionsPage}) => {
    await dataSetManagerActionsPage.goto();

    await expect(
        page.getByRole('tabpanel').getByText('No actions were created.')
    ).toBeVisible();
});

test('The "New Creation Action" button is present', async ({page, dataSetManagerActionsPage}) => {
    await dataSetManagerActionsPage.goto();

    await expect(
        page.getByRole('button', { name: 'New Item Action' })
    ).toBeVisible();
});

test('A new Link action is created', async ({page, dataSetManagerActionsPage}) => {
    await dataSetManagerActionsPage.goto();

    await dataSetManagerActionsPage.createTestDataSetAction({
        name: 'Link action', 
        type: 'link', 
        url: 'http://localhost:8080', 
        icon: 'arrow-right-full'
    });

    await expect(
        page.getByRole('cell', { name: 'Link action', exact: true }).locator('span').first()
    ).toBeVisible();
});

test('A new Modal action is created', async ({page, dataSetManagerActionsPage}) => {
    await dataSetManagerActionsPage.goto();

    await dataSetManagerActionsPage.createTestDataSetAction({
        name: 'Modal action', 
        type: 'modal', 
        url: 'http://localhost:8080', 
        icon: 'arrow-right-full'
    });

    await expect(
        page.getByRole('cell', { name: 'Modal action', exact: true }).locator('span').first()
    ).toBeVisible();
});

test('A new Side Panel action is created', async ({page, dataSetManagerActionsPage}) => {
    await dataSetManagerActionsPage.goto();

    await dataSetManagerActionsPage.createTestDataSetAction({
        name: 'Side panel action', 
        type: 'sidePanel', 
        url: 'http://localhost:8080', 
        icon: 'arrow-right-full'
    });

    await expect(
        page.getByRole('cell', { name: 'Side panel action', exact: true }).locator('span').first()
    ).toBeVisible();
});