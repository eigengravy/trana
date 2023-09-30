## Basic Working
The core app handle the upload and chat functionality. The endpoints can be accessed at `api/`.

The available endpoints are:
- `files/` - for file CRUD operations
    - `files/formatter/` - to format the uploaded file to text format
- `chat/` - for chat functionality
    - `chat/queries/` - accepts user queries and returns the response

Files will be uploaded to `uploads/files/`

## Commands
Start pip environment :
```
pipenv shell
```

To start server :
```
py manage.py runserver
```

After db updates
```
py manage.py makemigrations
py manage.py migrate
```

To clear db
```
py manage.py flush
```