import React from 'react';
import { View } from 'react-native'


import Card from '../components/Card';
import Title from '../components/Title';
import Button from '../components/Button';
import Input from '../components/Input';


const ComponentsShow = () => {
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
