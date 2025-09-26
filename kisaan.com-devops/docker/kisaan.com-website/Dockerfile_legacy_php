FROM bwalia/openresty119php74:2022-01-02-04-20

#COPY kisaan.com-devops/docker/php/php.ini /usr/local/etc/php/php.ini
COPY kisaan.com-devops/docker/nginx/nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

RUN mkdir -p /var/www/html/kisaan.com

# Setup website frontend
ADD kisaan.com /var/www/html/kisaan.com/

RUN chgrp www-data -R /var/www/html/kisaan.com/
RUN chmod 777 -R /var/www/html/kisaan.com/
