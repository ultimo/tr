<?php

namespace App\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use App\FrontendBundle\Entity\Contact;
use App\FrontendBundle\Form\ContactType;

class DefaultController extends Controller
{
    public function indexAction()
    {

        // creating the $contact entity and the $form
        $contact = new Contact();
        $form = $this->createForm(new ContactType(), $contact);

        // if $request is post, validate $form and send mail
        $request = $this->getRequest();
        if ($request->getMethod() == 'POST') {
            $form->bindRequest($request);
            if ($form->isValid()) {
                if ($this->sendEmail($contact)) {
				    $this->get('session')->setFlash('notice', 'Email sent!');
				    $this->get('session')->setFlash('status', 'success');
				} else {
				    $this->get('session')->setFlash('notice', 'Whoops, something has gone terribly wrong!');
				    $this->get('session')->setFlash('status', 'error');
				}
            }
        }

        return $this->render('AppFrontendBundle::index.html.twig', array('form' => $form->createView()));
    }

    /**
     * @param Contact $contact
     * @return type 1 (true) if send successfully, 0 (false) otherwise
     */
    private function sendEmail($contact) {
        $message = \Swift_Message::newInstance()
            ->setFrom($contact->getEmail())
            ->setSubject('Contact')
            ->setTo($this->container->getParameter('contact_recipient'))
            ->setBody($contact->getMessage());
        return $this->get('mailer')->send($message);
    }
}
