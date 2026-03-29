FROM php:8.4-fpm-alpine

ARG USERNAME
ARG UID
ARG EMAIL
ARG NAME

RUN echo "==============================="
RUN echo "$USERNAME ($UID)"
RUN echo "$NAME ($EMAIL)"
RUN echo "==============================="

# Mise à jour + installation bash, git, shadow
RUN apk upgrade && apk --no-cache add bash git shadow wget

# Installation NodeJS + npm
RUN apk --no-cache add nodejs npm

# Installation Composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && php -r "unlink('composer-setup.php');"

# Installation Symfony CLI
RUN wget https://get.symfony.com/cli/installer -O - | bash \
    && mv /root/.symfony*/bin/symfony /usr/local/bin/symfony

# Installation Angular CLI
RUN npm install -g typescript @angular/cli@^21

# Installation du driver PostgreSQL pour PHP
RUN apk add --no-cache postgresql-dev \
    && docker-php-ext-install pdo_pgsql pgsql

# Gestion utilisateur
RUN echo "UID_MAX 9223372036854775807" > /etc/login.defs \
    && useradd -m -s /bin/sh -u "$UID" "$USERNAME"

USER $USERNAME

# Configuration Git
RUN git config --global user.email "$EMAIL" \
    && git config --global user.name "$NAME"

WORKDIR /var/www/html
