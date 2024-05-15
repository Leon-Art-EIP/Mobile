import React, { useEffect } from 'react';
import { View } from 'react-native'


import Card from '../components/cards/Card';
import Title from '../components/text/Title';
import Button from '../components/buttons/Button';
import Input from '../components/textInput/Input';


const ComponentsShow = () => {
  useEffect(() => console.log('ComponentsShow'));

  return (
    <View>
      <Card>
        <Title>Buttons</Title>
        <Button value='primary' />
        <Button secondary value='secondary' />
        <Button tertiary value='tertiary' />
      </Card>
      <Card>
        <Title>Big title</Title>
        <Title bold>Bold title</Title>
        <Title size={36}>Medium title</Title>
        <Title size={24}>Small title</Title>
        <Title size={18}>Extra Small title</Title>
      </Card>
      <Card>
        <Title>Inputs</Title>
        <Input placeholder="Your text here" />
      </Card>
    </View>
  );
}


export default ComponentsShow;
