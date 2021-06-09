use MetacriticData;

create table  publishers (
publisher_id smallint not null auto_increment primary key,
publisher_name varchar(100) not null
);

insert into publishers(publisher_name)
select distinct publisher from `metacritic_data`;

select * from publishers;

update metacritic_data set publisher = (
select pu.publisher_id as 'new_values' from publishers as pu
where pu.publisher_name = metacritic_data.publisher);


