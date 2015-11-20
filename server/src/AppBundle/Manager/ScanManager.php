<?php

namespace AppBundle\Manager;

use AppBundle\Entity\Scan;
use Doctrine\ORM\EntityManager;

class ScanManager
{
    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @param EntityManager $em
     */
    public function __construct(EntityManager $em)
    {
        $this->em = $em;
    }

    /**
     * Convert data to scan list
     *
     * @param array $data
     *
     * @return Scan[]
     */
    public function saveFromJsonArray(array $data)
    {
        $scans = [];

        foreach ($data as $scanData) {
            $url = $scanData['url'];
            $date = new \DateTime($scanData['date']);
            $date->setTimezone(new \DateTimeZone('Europe/Paris'));
            $visitorId = null;

            $hashPosition = strpos($url, '#');
            if (false !== $hashPosition) {
                $visitorId = substr($url, $hashPosition+1);
                if (strlen($visitorId) && false !== filter_var($visitorId, FILTER_VALIDATE_INT)) {
                    $visitorId = intval($visitorId);
                } else {
                    $this->logger->warn('Invalid visitor id "'.$visitorId.'" in url '.$url);
                    $visitorId = null;
                }
            }

            $scan = new Scan();
            $scan->setUrl($url);
            $scan->setVisitorId($visitorId);
            $scan->setDate($date);

            $this->em->persist($scan);

            $scans[] = $scan;
        }

        if (count($scans)) {
            $this->em->flush();
        }

        return count($scans);
    }
}
