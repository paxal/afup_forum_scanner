<?php

namespace AppBundle\Security;

use Psr\Log\LoggerAwareInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class RequestListener implements EventSubscriberInterface, LoggerAwareInterface
{
    /**
     * @var string
     */
    private $token;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @__construct
     *
     * @param string $token AFUP Token
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Sets a logger instance on the object
     *
     * @param LoggerInterface $logger
     *
     * @return void
     */
    public function setLogger(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    /**
     * Check that afup token is correct if route is marked as secure.
     *
     * @param FilterControllerEvent $event
     *
     * @throws AccessDeniedHttpException
     */
    public function onKernelController(FilterControllerEvent $event)
    {
        $request = $event->getRequest();

        if (true === $request->attributes->get('api_secure')) {
            $requestToken = $request->headers->get('x-afup-token', null, true);
            if ($requestToken !== $this->token) {
                $this->logger->info(
                    'Invalid token',
                    [
                        'requestToken' => $requestToken,
                        'expectedToken' => $this->token
                    ]
                );

                throw new AccessDeniedHttpException();
            }
        }
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubscribedEvents()
    {
        return [ 'kernel.controller' => 'onKernelController' ];
    }
}
