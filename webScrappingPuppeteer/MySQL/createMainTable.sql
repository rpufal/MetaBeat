use MetacriticData;
create table `metacritic_data` (
	id smallint not null auto_increment primary key,
	title varchar(100) not null,
    metacritic_score tinyint not null,
    user_score decimal(2,1) not null,
    platform varchar(50) not null,
    publisher varchar(100) not null,
    developer varchar(100) not null,
    release_date varchar(100) not null,
    summary text,
    number_of_critics tinyint,
    genres tinytext
);

-- load data from agregated table
load data  local infile '/home/administrador/Desktop/Portfolio/MetaBeat/webScrappingPuppeteer/metaDetails/fullTable.tsv'
into table MetacriticData.`metacritic_data`
fields terminated by '	'
lines terminated by '\n';

-- treat problematic rows 569 752 1790
delete from metacritic_data where title = "null";
delete from metacritic_data where id = 752;
delete from metacritic_data where id = 1790;

-- update date format
update metacritic_data as m1, metacritic_data as m2
set m1.release_date = str_to_date(concat(trim(substring(m2.release_date,1,4)),',',
trim(substring(m2.release_date,5,11))),'%M,%d,%Y');

