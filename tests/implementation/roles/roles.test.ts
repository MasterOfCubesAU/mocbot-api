/* eslint-disable quote-props */
import DB from '@utils/DBHandler';
import { createRoles, getRoles, setRoles, updateRoles, deleteRoles } from '@src/roles';

// Ensure DB is in a predictable state by clearing it initially, then again after every test
// We then close the DB at the end to remove any open handles
beforeAll(async () => {
  await DB.execute('DELETE FROM Roles');
});
afterEach(async () => {
  await DB.execute('DELETE FROM Roles');
});
afterAll(() => DB.close());

const VALID_JOIN_ROLES = { JoinRoles: ['1', '2', '3'] };
const VALID_LEVEL_ROLES = { LevelRoles: { '1': '123', '2': '456', '3': '789' } };
const COMBINED_ROLES = Object.assign({}, VALID_JOIN_ROLES, VALID_LEVEL_ROLES);

describe('Create Roles', () => {
  test('Valid (JoinRoles)', async () => {
    expect(await createRoles(1, VALID_JOIN_ROLES)).toStrictEqual(Object.assign({}, VALID_JOIN_ROLES, { LevelRoles: null }));
  });
  test('Valid (LevelRoles)', async () => {
    expect(await createRoles(1, VALID_LEVEL_ROLES)).toStrictEqual(Object.assign({}, VALID_LEVEL_ROLES, { JoinRoles: null }));
  });
  test('Valid (Combined)', async () => {
    expect(await createRoles(1, COMBINED_ROLES)).toStrictEqual(COMBINED_ROLES);
  });
  test('No roles provided', async () => {
    await expect(createRoles(1, {})).rejects.toThrow();
  });
  test('No roles provided (key exists, empty object)', async () => {
    await expect(createRoles(1, { LevelRoles: {}, JoinRoles: [] })).rejects.toThrow();
  });
  test('Roles already exist', async () => {
    await createRoles(1, VALID_LEVEL_ROLES);
    await expect(createRoles(1, VALID_LEVEL_ROLES)).rejects.toThrow();
  });
});

describe('Get Roles', () => {
  test('Valid', async () => {
    await createRoles(1, VALID_LEVEL_ROLES);
    expect(await getRoles(1)).toStrictEqual(Object.assign({}, VALID_LEVEL_ROLES, { JoinRoles: null }));
  });
  test('Guild ID not found', async () => {
    await expect(getRoles(1)).rejects.toThrow();
  });
});

describe('Update Roles', () => {
  test('Valid (JoinRoles)', async () => {
    await createRoles(1, COMBINED_ROLES);
    expect(await updateRoles(1, { JoinRoles: ['4', '5', '6'] })).toStrictEqual(Object.assign({}, VALID_LEVEL_ROLES, { JoinRoles: ['1', '2', '3', '4', '5', '6'] }));
  });
  test('Valid (LevelRoles)', async () => {
    await createRoles(1, COMBINED_ROLES);
    expect(await updateRoles(1, { LevelRoles: { '1': '246', '2': '8' } })).toStrictEqual(Object.assign({}, VALID_JOIN_ROLES, { LevelRoles: { '1': '246', '2': '8', '3': '789' } }));
  });
  test('Valid (Combined)', async () => {
    await createRoles(1, COMBINED_ROLES);
    expect(await updateRoles(1, { LevelRoles: { '1': '453', '2': '3425' }, JoinRoles: ['100', '200', '300'] })).toStrictEqual({
      LevelRoles: { '1': '453', '2': '3425', '3': '789' },
      JoinRoles: ['1', '2', '3', '100', '200', '300'],
    });
  });
  test('No roles provided', async () => {
    await createRoles(1, COMBINED_ROLES);
    await expect(updateRoles(1, {})).rejects.toThrow();
  });
  test('No roles provided (key exists, empty object)', async () => {
    await createRoles(1, COMBINED_ROLES);
    await expect(updateRoles(1, { LevelRoles: {}, JoinRoles: [] })).rejects.toThrow();
  });
  test('Guild ID not found', async () => {
    await expect(updateRoles(1, { JoinRoles: ['4', '5', '6'] })).rejects.toThrow();
  });
});

describe('Set Roles', () => {
  test('Valid (JoinRoles)', async () => {
    await createRoles(1, COMBINED_ROLES);
    expect(await setRoles(1, VALID_JOIN_ROLES)).toStrictEqual(Object.assign({}, VALID_JOIN_ROLES, { LevelRoles: null }));
  });
  test('Valid (LevelRoles)', async () => {
    await createRoles(1, COMBINED_ROLES);
    expect(await setRoles(1, VALID_LEVEL_ROLES)).toStrictEqual(Object.assign({}, VALID_LEVEL_ROLES, { JoinRoles: null }));
  });
  test('Valid (Combined)', async () => {
    await createRoles(1, COMBINED_ROLES);
    expect(await setRoles(1, { LevelRoles: { '1': '987' }, JoinRoles: ['987'] })).toStrictEqual({ LevelRoles: { '1': '987' }, JoinRoles: ['987'] });
  });
  test('No roles provided', async () => {
    await createRoles(1, COMBINED_ROLES);
    await expect(setRoles(1, {})).rejects.toThrow();
  });
  test('No roles provided (key exists, empty object)', async () => {
    await createRoles(1, COMBINED_ROLES);
    await expect(setRoles(1, { LevelRoles: {}, JoinRoles: [] })).rejects.toThrow();
  });
  test('Guild ID not found', async () => {
    await expect(setRoles(1, VALID_LEVEL_ROLES)).rejects.toThrow();
  });
});

describe('Delete settings', () => {
  test('Valid', async () => {
    await expect(createRoles(1, COMBINED_ROLES)).resolves.not.toThrow();
    await expect(deleteRoles(1)).resolves.not.toThrow();
    await expect(getRoles(1)).rejects.toThrow();
  });
  test('Guild ID does not exist', async () => {
    await expect(deleteRoles(1)).rejects.toThrow();
  });
});
