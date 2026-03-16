<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260315235042 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE alerte DROP CONSTRAINT fk_3ae753ad957c174');
        $this->addSql('DROP INDEX uniq_3ae753ad957c174');
        $this->addSql('ALTER TABLE alerte DROP demande_echantillon_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE alerte ADD demande_echantillon_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE alerte ADD CONSTRAINT fk_3ae753ad957c174 FOREIGN KEY (demande_echantillon_id) REFERENCES demande_echantillon (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX uniq_3ae753ad957c174 ON alerte (demande_echantillon_id)');
    }
}
