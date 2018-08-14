FROM vulnerables/web-dvwa

LABEL maintainer "chris@chris-allen-lane.com"

# Copy the novahot PHP trojan file to the documentroot and set the appropriate
# file permissions
ADD https://raw.githubusercontent.com/chrisallenlane/novahot/master/trojans/reference-php5.php /var/www/html/novahot.php
RUN chown www-data:www-data /var/www/html/novahot.php
