use MetacriticData;

create table  platforms (
platform_id smallint not null auto_increment primary key,
platform_name varchar(100) not null
);

insert into platforms(platform_name)
select distinct platform from `metacritic_data`;

select * from platforms;

update metacritic_data set platform = (
select pl.platform_id as 'new_values' from platforms as pl
where pl.platform_name = metacritic_data.platform);

