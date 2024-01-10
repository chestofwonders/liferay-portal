import {expect, mergeTests} from '@playwright/test';

import {FDSPagesTest} from '../../fixtures/FDSPages.fixture';

export const test = mergeTests(
	FDSPagesTest
);

test.describe('LPS-186875 Create generic creation button actions', () => {

    test.afterAll(async () => {
        console.log('Done with tests...time to clean the database (still in progress, see https://playwright.dev/docs/test-retries#reuse-single-page-between-tests)');
    });

    test('Data Set Test is created', async ({page, _FDSPage}) => {
        await _FDSPage.goto();

        await expect(
            page.getByRole('link', { name: /Data Set Test/ }).first()
        ).toBeVisible();
    });

    test('View Test is created', async ({page, _FDSViewPage}) => {
        await _FDSViewPage.createTestDataSetView();

        await expect( 
            page.getByRole('heading', {name: /New Data Set View/})
		).toBeVisible();
    });

    test('There are no item actions created in the Action tab', async ({page, _FDSActionsPage}) => {
        await _FDSActionsPage.goto();
   
        await expect(page.getByRole('tabpanel').getByText(/No actions were created./)).toBeVisible();
    });

    test('The "New Creation Action" button is present', async ({page, _FDSActionsPage}) => {
        await _FDSActionsPage.goto();

        await expect(
            page.getByRole('button', { name: /New Item Action/ })
        ).toBeVisible();
    });
 
    test('A new Link action is created', async ({page, _FDSActionsPage}) => {
        await _FDSActionsPage.goto();

        await _FDSActionsPage.create({
            name: 'Link action', 
            type: 'link', 
            url: 'http://localhost:8080', 
            icon: 'arrow-right-full'
        });

        await expect(
            page.getByRole('cell', { name: 'Link action', exact: true }).locator('span').first()
        ).toBeVisible();
    });

    test('A new Modal action is created', async ({page, _FDSActionsPage}) => {
        await _FDSActionsPage.goto();

        await _FDSActionsPage.create({
            name: 'Modal action', 
            type: 'modal', 
            url: 'http://localhost:8080', 
            icon: 'arrow-right-full'
        });

        await expect(
            page.getByRole('cell', { name: 'Modal action', exact: true }).locator('span').first()
        ).toBeVisible();
    });

    test('A new Side Panel action is created', async ({page, _FDSActionsPage}) => {
        await _FDSActionsPage.goto();

        await _FDSActionsPage.create({
            name: 'Side panel action', 
            type: 'sidePanel', 
            url: 'http://localhost:8080', 
            icon: 'arrow-right-full'
        });
    
        await expect(
            page.getByRole('cell', { name: 'Side panel action', exact: true }).locator('span').first()
        ).toBeVisible();
    });

});