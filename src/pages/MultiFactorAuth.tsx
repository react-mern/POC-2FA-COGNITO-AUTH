import Card from '@/components/card/CardLayout';
import MFAForm from '@/components/form/MFAForm';

const MultiFactorAuth = () => {
  return (
    <Card>
      <Card.Header>
        <Card.Title>2FA</Card.Title>
      </Card.Header>
      <Card.Content>
        <MFAForm />
      </Card.Content>
    </Card>
  );
};

export default MultiFactorAuth;
