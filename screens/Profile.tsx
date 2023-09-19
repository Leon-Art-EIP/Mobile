import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native'
import colors from '../constants/colors';
import bannerImage from '../assets/images/banner.jpg'
import profilePicture from '../assets/images/user.png'

const ProfileScreen = () => {
  // Placer ici les élements de boutons
    // const [email, setEmail] = useState<string | undefined>(undefined);

  // Placer ici les handles
  return (
    <View>
      {/* Bannière en haut de l'écran */}
      <View style={styles.banner}>
        <Image
          source={bannerImage} // Remplacez par le chemin de votre image
          style={styles.bannerImage} // Style pour l'image
          resizeMode="cover" // Pour remplir la bannière
        />
      </View>
      {/* Contenu de l'écran en dessous de la bannière */}
      <View style={styles.overlayImage}>
        <View style={styles.circleImageContainer}>
          <Image
            source={profilePicture} // Chemin de votre image
            style={styles.profilePicture}
            // style={styles.overlayImage} // Style pour l'image par-dessus
          />
        </View>
      </View>
      
      <View style={styles.content}>
        <Text>Profile screen</Text>
        {/* Ajoutez d'autres éléments de contenu ici */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    // Style de la bannière
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
    width: 150,
    height: 150,
  },
  circleImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 100, // La moitié de la largeur/hauteur pour créer un cercle
    overflow: 'hidden', // Cache tout ce qui dépasse du cercle
  },
  content: {
    padding: 16
  },
  container: {
    flex: 1,
    padding: 16,
  },
});

export default ProfileScreen;
