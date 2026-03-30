<?php

namespace App\Repository;

use App\Entity\MatPremiere;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<MatPremiere>
 */
class MatPremiereRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MatPremiere::class);
    }

    //    /**
    //     * @return MatPremiere[] Returns an array of MatPremiere objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('m.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?MatPremiere
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
    // 🔥 AJOUTE CETTE MÉTHODE
   // src/Repository/MatPremiereRepository.php
public function findAllWithoutRelations(): array
{
    // 🔥 Charge seulement les matières, pas les relations
    return $this->createQueryBuilder('m')
        ->getQuery()
        ->getResult();
}
}
