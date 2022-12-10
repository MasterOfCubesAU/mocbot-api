![MOCBOT_API](https://user-images.githubusercontent.com/38149391/206867071-92e9e181-6c16-41ae-9c98-476919729782.png)
# MOCBOT API

- [MOCBOT API](#mocbot-api)
  - [XP](#xp)
    - [Read XP Data](#read-xp-data)
  - [Guild Settings](#guild-settings)
    - [Create Guild Settings](#create-guild-settings)
    - [Read Guild Settings](#read-guild-settings)
    - [Update Guild Settings](#update-guild-settings)
  - [Warnings](#warnings)
    - [Read Warning Data](#read-warning-data)
    - [Delete Warning](#delete-warning)


## XP

### Read XP Data
```html
GET /api/xp/{guild_id}/{user_id}
```

**Description**:

This route fetches all XP data for a given guild and optionally, the XP for a user in the given guild.

- If only the `guild_id` is provided, all XP data for the given guild will be returned. 
- If and only if both `guild_id` and `user_id` are provided, the XP data for that user within the given guild will be returned.

| Parameter  | Type  | Required | Description                                       |
| ---------- | ----- | -------- | ------------------------------------------------- |
| `guild_id` | `int` | True     | The Guild ID you would like to fetch XP data for. |
| `user_id`  | `int` | False    | The User ID you would like to fetch XP data for.  |


## Guild Settings

### Create Guild Settings
```html
POST /api/settings/{guild_id}
```
**Description**:

This route creates a configuration for the given guild.

| Parameter  | Type  | Required | Description                                         |
| ---------- | ----- | -------- | --------------------------------------------------- |
| `guild_id` | `int` | True     | The Guild ID you would like to create settings for. |

### Read Guild Settings
```html
GET /api/settings/{guild_id}
```
**Description**:

This route fetches the current configuration for the given guild.

| Parameter  | Type  | Required | Description                                            |
| ---------- | ----- | -------- | ------------------------------------------------------ |
| `guild_id` | `int` | True     | The Guild ID you would like to fetch the settings for. |

### Update Guild Settings
```html
PATCH /api/settings/{guild_id}
```
**Description**:

This route updates an existing configuration for the given guild.

| Parameter  | Type  | Required | Description                                         |
| ---------- | ----- | -------- | --------------------------------------------------- |
| `guild_id` | `int` | True     | The Guild ID you would like to create settings for. |

## Warnings

### Read Warning Data
```html
GET /api/warnings/{guild_id}/{user_id}
```

**Description**:

This route fetches all warnings for a given guild and optionally, the warnings for a user in the given guild.

- If only the `guild_id` is provided, all warning data for the given guild will be returned. 
- If and only if both `guild_id` and `user_id` are provided, the warning data for that user within the given guild will be returned.

| Parameter  | Type  | Required | Description                                            |
| ---------- | ----- | -------- | ------------------------------------------------------ |
| `guild_id` | `int` | True     | The Guild ID you would like to fetch warning data for. |
| `user_id`  | `int` | False    | The User ID you would like to fetch warning data for.  |

### Delete Warning
```html
DELETE /api/warnings/{warning_id}
```

**Description**:

This route will delete a given warning.


| Parameter    | Type  | Required | Description                              |
| ------------ | ----- | -------- | ---------------------------------------- |
| `warning_id` | `int` | True     | The Warning ID you would like to delete. |


