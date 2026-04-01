FROM php:8.4-fpm-alpine
ARG USERNAME
ARG UID
ARG EMAIL
ARG NAME

RUN echo "==============================="
RUN echo "$USERNAME ($UID)"
RUN echo "$NAME ($EMAIL)"
RUN echo "==============================="

# installation bash
RUN apk upgrade && apk --no-cache add bash git shadow

# installation npm et nodejs
RUN apk --no-cache add npm nodejs>=22

# installation de composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
&& php composer-setup.php --install-dir=/usr/local/bin \
&& php -r "unlink('composer-setup.php');"

# installation de symfony
RUN wget https://get.symfony.com/cli/installer -O - | bash \
&& mv /root/.symfony5/bin/symfony /usr/local/bin/symfony

# installation de Angular
RUN npm install -g typescript @angular/cli@^21


# Installation de PostgreSQL pour PHP
RUN apk add --no-cache postgresql-dev \
    && docker-php-ext-install pdo_pgsql

# Gestion user
RUN echo "UID_MAX 9223372036854775807" > /etc/login.defs
RUN /usr/sbin/useradd -m -s /bin/sh -u "$UID" $USERNAME
USER $USERNAME

# config git
RUN git config --global user.email "$EMAIL"
RUN git config --global user.name "$NAME"

WORKDIR /var/www/html


    