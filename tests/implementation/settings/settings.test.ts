import DB from '@utils/DBHandler';
import { createSettings, getGuildSettings, getAllSettings, setSettings, deleteSettings, updateSettings } from '@src/settings';

// Ensure DB is in a predictable state by clearing it initially, then again after every test
// We then close the DB at the end to remove any open handles
beforeAll(async () => {
  await DB.execute('DELETE FROM GuildSettings');
});
afterEach(async () => {
  await DB.execute('DELETE FROM GuildSettings');
});
afterAll(() => DB.close());

describe('Create settings', () => {
  test('Valid', async () => {
    await expect(createSettings(1, { setting1: true })).resolves.not.toThrow();
  });
  test('No settings', async () => {
    await expect(createSettings(1, {})).rejects.toThrow();
  });
  test('Guild already exist', async () => {
    await expect(createSettings(1, { setting1: true })).resolves.not.toThrow();
    await expect(createSettings(1, {})).rejects.toThrow();
  });
});

describe('Get guild settings', () => {
  test('Valid', async () => {
    await expect(createSettings(1, { setting1: true })).resolves.not.toThrow();
    await expect(getGuildSettings(1)).resolves.not.toThrow();
    expect(await getGuildSettings(1)).toStrictEqual({ setting1: true });
  });
  test('Guild ID does not exist', async () => {
    await expect(getGuildSettings(1)).rejects.toThrow();
  });
});

describe('Get all settings', () => {
  test('Valid', async () => {
    await expect(createSettings(1, { setting1: true })).resolves.not.toThrow();
    await expect(createSettings(2, { setting2: true })).resolves.not.toThrow();
    expect(await getAllSettings()).toStrictEqual([
      { GuildID: '1', SettingsData: { setting1: true } },
      { GuildID: '2', SettingsData: { setting2: true } },
    ]);
  });
  test('Guild ID does not exist', async () => {
    await expect(getAllSettings()).rejects.toThrow();
  });
});

describe('Set settings', () => {
  test('Valid', async () => {
    await expect(createSettings(1, { setting1: true, setting2: false, setting3: {} })).resolves.not.toThrow();
    const EXPECTED = { setting1: false };
    const FUNC_CALL = expect(setSettings(1, EXPECTED));

    FUNC_CALL.resolves.not.toThrow();
    FUNC_CALL.resolves.toStrictEqual(EXPECTED);
  });
  test('Guild ID does not exist', async () => {
    await expect(setSettings(1, { setting1: false })).rejects.toThrow();
  });
  test('Empty settings', async () => {
    await expect(createSettings(1, { setting1: true, setting2: false, setting3: {} })).resolves.not.toThrow();
    await expect(setSettings(1, {})).rejects.toThrow();
  });
});

describe('Update settings', () => {
  test('Valid (single value)', async () => {
    await expect(createSettings(1, { setting1: true, setting2: { a: true, b: false } })).resolves.not.toThrow();
    const FUNC_CALL = expect(updateSettings(1, { setting2: { a: false } }));

    const EXPECTED = { setting1: true, setting2: { a: false } };
    FUNC_CALL.resolves.not.toThrow();
    FUNC_CALL.resolves.toStrictEqual(EXPECTED);
  });
  test('Valid (all values)', async () => {
    const EXPECTED = { setting1: false, setting2: { a: true, b: false } };

    await expect(createSettings(1, { setting1: true, setting2: { a: true, b: false } })).resolves.not.toThrow();
    const FUNC_CALL = expect(updateSettings(1, EXPECTED));

    FUNC_CALL.resolves.not.toThrow();
    FUNC_CALL.resolves.toStrictEqual(EXPECTED);
  });
  test('Guild does not exist', async () => {
    await expect(updateSettings(1, { setting1: true })).rejects.toThrow();
  });
  test('Settings is empty', async () => {
    await expect(createSettings(1, { setting1: true, setting2: { a: true, b: false } })).resolves.not.toThrow();
    await expect(updateSettings(1, {})).rejects.toThrow();
  });
});

describe('Delete settings', () => {
  test('Valid', async () => {
    await expect(createSettings(1, { setting1: true })).resolves.not.toThrow();
    await expect(deleteSettings(1)).resolves.not.toThrow();
    await expect(getGuildSettings(1)).rejects.toThrow();
  });
  test('Guild ID does not exist', async () => {
    await expect(deleteSettings(1)).rejects.toThrow();
  });
});
