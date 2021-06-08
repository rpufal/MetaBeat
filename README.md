## Web Scrapping Metacritic.com and HowLongToBeat.com with Puppeteer


## About
This is a project for everyone whose first questions when choosing a new game to play are: 
- "How is this title evaluated by the critics and the community?";
- "How much time will it take to complete? Will it be worth it?";
-" Are there other games like this one that are better?";

Although these questions could be answered elsewhere, they usually aren't aggregated in a single place!

Hence, I gathered some info from the top 300 (or as many as there are ...)  games for eleven different platforms from two websites:
- www.metacritic.com/game ;
- www.howlongtobeat.com ;

The web scrapper utilized for the aforementioned task is "[Puppeteer](https://pptr.dev/)" ; a JavaScript library that simulates human behaviour ~~as well as it can~~.
Moreover, MySQL was employed for primary data treatment and database modelling.

  

🚧 Currently MongoDB is being applied to reconstruct the database and build the scaffold for an API   🚧

## Implement yourself

If you're curious ~~and i didn't finish the project yet~~  you may download a mysql dump file and reconstruct the database with the following steps:
Download the metacritic_dump_file.sql

    sudo apt update
    sudo apt install mysql-server
    mysqldump -u [user] -p [database_name] < [path/to/metacritic_dump_file.sql]
    


## Author
[@rpufal](https://github.com/rpufal)
