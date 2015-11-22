<?php

namespace AppBundle\Controller;

use AppBundle\Manager\ScanManager;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @Route(service="app.controller.api")
 */
class ApiController
{
    /**
     * @var ScanManager
     */
    private $scanManager;

    /**
     * @param ScanManager $scanManager
     */
    public function __construct(ScanManager $scanManager)
    {
        $this->scanManager = $scanManager;
    }

    /**
     * @Route("/", methods={"GET"})
     * @Template()
     */
    public function indexAction()
    {
        return [];
    }

    /**
     * Handle OPTIONS request that is sent by browsers.
     *
     * @Route("/", methods={"OPTIONS"}, defaults={"api_secure"=false})
     */
    public function optionsAction(Request $request)
    {
        $responseHeaders = array_merge(
            [
                'Access-Control-Allow-Methods' => 'OPTIONS, POST',
            ],
            $this->getAllowedRequestHeaders()
        );

        $headers = $request->headers->all();
        foreach ($headers as $name => $value) {
            if (preg_match('@access-control-request-(.*)@', $name, $matches)) {
                $responseHeaders['Access-Control-Allow-'.$matches[1]] = $value;
            }
        }

        foreach ($responseHeaders as $name => $value) {
            if (strcasecmp('access-control-allow-headers', $name) === 0) {
                $value = is_array($value) ? join(',', $value) : $value;
                $responseHeaders[$name] = $value.', x-afup-token';
            }
        }

        return new JsonResponse(
            'ok',
            200,
            $responseHeaders
        );
    }

    /**
     * Save the post urls.
     *
     * @Route("/", methods={"POST"}, defaults={"api_secure"=true})
     */
    public function saveAction(Request $request)
    {
        sleep(1);
        $urls = json_decode($request->getContent(false), true);

        $this->scanManager->saveFromJsonArray($urls);

        return new JsonResponse(['ok :)'], 200, $this->getAllowedRequestHeaders());
    }

    /**
     * Return headers that will make the request valid for browsers
     *
     * @return array
     */
    private function getAllowedRequestHeaders()
    {
        return [
            'Access-Control-Allow-Origin' => '*', // You have the token ? Good for you :)
        ];
    }
}
