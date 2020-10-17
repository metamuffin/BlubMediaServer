
#!/bin/sh
if !(mongo 127.0.0.1/media --eval "db.dropDatabase()" --quiet | jq ".dropped" -e > /dev/null)
	then echo 'Bruh! The Database is already reset.';
fi
