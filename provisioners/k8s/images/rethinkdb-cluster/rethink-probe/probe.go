package main

import (
	"log"
	"net/url"
	"os"

	r "gopkg.in/gorethink/gorethink.v2"
)

func main() {
	url, err := url.Parse(os.Getenv("RETHINKDB_URL"))
	if err != nil {
		url, _ = url.Parse("localhost:28015")
	}

	opts := &r.ConnectOpts{
		Address: url.Host,
	}

	if url.User != nil {
		password, isSet := url.User.Password()
		if !isSet {
			panic("Password not especified correctly in $RETHINKDB_URL")
		}
		opts.Username = url.User.Username()
		opts.Password = password
	} else {
		opts.Username = "admin"
		opts.Password = os.Getenv("RETHINKDB_PASSWORD")
	}

	session, err := r.Connect(*opts)
	if err != nil {
		log.Fatalln(err.Error())
	}

	res, err := r.Table("server_status").Pluck("id", "name").Run(session)
	if err != nil {
		log.Fatalln(err.Error())
	}
	defer res.Close()

	if res.IsNil() {
		log.Fatalln("no server status results found")
	}

	log.Printf("A-OK!")
}
