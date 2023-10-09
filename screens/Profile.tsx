import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'
import colors from '../constants/colors';
// import bannerImage from '../assets/images/banner.jpg'
import profilePicture from '../assets/images/user.png'
// import BackArrow from '../assets/images/back_arrow.png'
import Button from '../components/Button';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  // Placer ici les élements de boutons
  const [activeTab, setActiveTab] = useState('Artwork'); // État pour suivre le dernier bouton cliqué
  // Placer ici les handles
  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  useFocusEffect(
    React.useCallback(() => {
      // Vous pouvez laisser cette fonction de rappel vide car vous avez déjà déclaré handleBackButtonClick
      // en dehors de cette fonction.
    }, [navigation])
  );

  return (
    <ScrollView nestedScrollEnabled>
    <View>
      {/* Bouton de retour en haut à gauche */}
      <TouchableOpacity
          onPress={() => handleBackButtonClick()}
          style={styles.backButton}
        >
          {/* Utilisez l'image PNG importée */}
          <Image source={BackArrow} style={{ width: 24, height: 24, tintColor: 'white' }} />
        </TouchableOpacity>
      {/* Bannière */}
      <View style={styles.banner}>
        <Image
          source={bannerImage} // Remplacez par le chemin de votre image
          style={styles.bannerImage} // Style pour l'image
          resizeMode="cover" // Pour remplir la bannière
        />
      </View>
      {/* Photo de profile */}
      <View style={styles.overlayImage}>
        <View style={styles.circleImageContainer}>
          <Image
            source={profilePicture}
            style={styles.profilePicture}
          />
        </View>
      </View>
      {/* Blocs de texte */}
      <View style={styles.textBlocks}>
        {/* Bloc de texte follower */}
        <View style={styles.textBlock}>
          {/* TODO : remplacer par les vrais valeurs */}
          <Text style={styles.value}>1.3k</Text>
          <Text style={styles.title}>followers</Text>
        </View>

        {/* Bloc de texte au centre */}
        <View style={styles.centerTextBlock}>
          {/* TODO : remplacer par les vrais valeurs */}
          <Text style={styles.centerTitle}>Linus T</Text>
          <Text style={styles.centerSubtitle}>Ouvert aux commandes</Text>
        </View>

        {/* Bloc de texte posts */}
        <View style={styles.textBlock}>
          {/* TODO : remplacer par les vrais valeurs */}
          <Text style={styles.value}>64</Text>
          <Text style={styles.title}>posts</Text>
        </View>
      </View>
      {/* Boutons "Suivre" et "Ecrire" */}
      {/* <View style={styles.contactAndFollow}>
        <Button
          value="Suivre"
          style={{width: 150, height: 38, borderRadius: 10, justifyContent: 'center',}}
          textStyle={{fontSize: 14, textAlign: 'center', paddingTop: -100}}
          />
        <Button
          value="Ecrire"
          secondary
          style={{width: 150, height: 38, borderRadius: 10,}}
          textStyle={{fontSize: 14}}
          />
      </View> */}
      {/* Trait décoratif de séparation */}
      <View style={styles.decorativeLine} />
      {/* Boutons d'onglet, "Artwork", "Collections" et "A propos" */}
      <View style={styles.tabsNavigation}>
        <Button
          value="Artwork"
          secondary={activeTab !== 'Artwork'} // Utilisez secondary si ce n'est pas le bouton actif
          tertiary={activeTab === 'Artwork'} // Utilisez tertiary si c'est le bouton actif
          style={[styles.navigationTabButton, styles.marginRightForTabs]}
          textStyle={styles.navigationTabButtonText}
          onPress={() => setActiveTab('Artwork')} // Met à jour le bouton actif
          />
        <Button
          value="Collection"
          secondary={activeTab !== 'Collection'}
          tertiary={activeTab === 'Collection'}
          style={[styles.navigationTabButton, styles.marginRightForTabs]}
          textStyle={styles.navigationTabButtonText}
          onPress={() => setActiveTab('Collection')} // Met à jour le bouton actif
          />
        <Button
          value="A propos"
          secondary={activeTab !== 'A propos'}
          tertiary={activeTab === 'A propos'}
          style={styles.navigationTabButton}
          textStyle={styles.navigationTabButtonText}
          onPress={() => setActiveTab('A propos')} // Met à jour le bouton actif
          />
      </View>
      {/* Ensembles de cadres carrés */}
      {activeTab === 'Artwork' &&
        Array.from({ length: 7 }, (_, rowIndex) => (
          <View key={rowIndex} style={styles.rowContainer}>
            {Array.from({ length: 3 }, (_, colIndex) => (
              <View key={colIndex} style={styles.squareFrame} />
            ))}
          </View>
        ))
      }
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  banner: { // Style de la bannière
    backgroundColor: 'lightblue',
    height: 180, // Hauteur de la bannière (ajustez selon vos besoins)
    width: '100%', // Largeur de la bannière
    justifyContent: 'center', // Aligner l'image au centre verticalement
    alignItems: 'center', // Centrer l'image horizontalement
  },
  bannerImage: {
    width: '100%', // Pour remplir la largeur de la bannière
    height: '100%', // Pour remplir la hauteur de la bannière
  },
  overlayImage: {
    flex: 1,
    justifyContent: 'center', // Centrer l'image verticalement
    alignItems: 'center', // Centrer horizontalement l'image
  },
  profilePicture: {
    width: 110,
    height: 110,
  },
  circleImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 100, // La moitié de la largeur/hauteur pour créer un cercle
    overflow: 'hidden', // Cache tout ce qui dépasse du cercle
    position: 'absolute',
    top: -55, // L'image est remontée de moitiée pour que son centre
    // soit sur le bord infèrieur de la bannière.
  },
  textBlocks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 70,
  },
  textBlock: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: '400',
    color: colors.tertiary,
  },
  value: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.tertiary,
  },
  centerTextBlock: {
    flex: 1,
    alignItems: 'center',
  },
  centerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.tertiary,
  },
  centerSubtitle: {
    fontSize: 12,
    color: 'rgba(112, 0, 255, 1)', // TODO : mettre une valeur provenant de colors
  },
  contactAndFollow: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 37,
    flexDirection: 'row',
    paddingVertical: 0,
    paddingHorizontal: 17,
  },
  decorativeLine: {
    height: 1,
    backgroundColor: colors.tertiary,
    marginVertical: 10, // Espace verticalement
    marginLeft: 30,
    marginRight: 30,
  },
  tabsNavigation: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  navigationTabButton: {
    width: 105, height: 38, justifyContent: 'center',
  },
  navigationTabButtonText: {
    fontSize: 12,
  },
  marginRightForTabs: {
    marginRight: 5, // Espacement entre chaque bouton d'onglet
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginLeft: 20,
    marginRight: 20,
  },
  squareFrame: {
    width: 115, // Largeur souhaitée du cadre carré
    height: 115, // Hauteur souhaitée du cadre carré
    backgroundColor: 'lightgray', // Couleur de fond du cadre
    borderRadius: 10, // Légèrement arrondi sur les bords
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1, // Pour placer le bouton au-dessus de la bannière
  },
});

export default ProfileScreen;
