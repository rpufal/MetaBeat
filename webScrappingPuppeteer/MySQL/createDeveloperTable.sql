use MetacriticData;

create table  developers (
developer_id smallint not null auto_increment primary key,
developer_name varchar(100) not null
);

insert into developers(developer_name)
select distinct developer from `metacritic_data`;

select * from developers;

update metacritic_data set developer = (
select dev.developer_id as 'new_values' from developers as dev
where dev.developer_name = metacritic_data.developer);


