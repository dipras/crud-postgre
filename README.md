# crud-postgre

## Install
```bash
yarn install
```

## Development

### Configuration Database
- untuk cofigurasi nya ada di file db.js
- untuk migrasi seeder nya cukup execute migration.js

### Compile and Run Express
```bash

// nodemon watch change files
yard start
```

## Table struktur endpoint api
| URL                                              | Method | INFO                              |
| ------------------------------------------------ | ------ | --------------------------------- |
| `/get`                                           | GET    | Ambil semua data                  |
| `/get/:id`                                       | GET    | Ambil data by Id                  |
| `/excel`                                         | GET    | Save Excel                        |
| `/store`                                         | POST   | Store data                        |
| `/update/:id`                                    | POST   | Update data                       |
| `/delete/:id`                                    | GET    | Delete data                       |

### Documentasi API
- https://crudpostgres.docs.apiary.io/#
