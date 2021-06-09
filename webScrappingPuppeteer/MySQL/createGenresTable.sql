create table gameGenres (
	id smallint,
    genre_name varchar(50) not null,
    primary key (id, genre_name)
);


load data  local infile '/home/administrador/Desktop/Portfolio/MetaBeat/webScrappingPuppeteer/metaDetails/genresTable.csv'
into table MetacriticData.`gameGenres`
fields terminated by ';'
lines terminated by '\n';

select count(*) from gameGenres;