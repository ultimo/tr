<?php
// src/App/FrontendBundle/Form/ContactType.php

namespace App\FrontendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

class ContactType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('name', 'text');
        $builder->add('email', 'email');
        $builder->add('message', 'textarea');
    }

    public function getName()
    {
        return 'contact';
    }
}
?>