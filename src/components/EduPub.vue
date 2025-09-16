<template>
  <section class="edu-pub-container">
    <!-- Sezione EDU -->
    <div class="section edu-section">
      <div class="content">
        <h1 class="title">{{ $t("edumain.title") }}</h1>
        <p class="description">{{ $t("edumain.description") }}</p>
        <router-link to="/edu" class="button">{{ $t("edumain.learnMore") }}</router-link>
      </div>
      <img
        src="/assets/gufo.webp"
        alt="EDU Image"
        class="section-image"
      />
    </div>

    <!-- Sezione PUB -->
    <div class="section pub-section">
      <div class="content">
        <h1 class="title">{{ $t("pubmain.title") }}</h1>
        <p class="description">{{ $t("pubmain.description") }}</p>
        <router-link to="/pub" class="button">{{ $t("pubmain.explore") }}</router-link>
      </div>
      <img
        src="/assets/bear.webp"
        alt="PUB Image"
        class="section-image"
      />
    </div>
  </section>
</template>


<script>
import { ref } from "vue";

export default {
  name: "EduPubSection",
  setup() {
    const showEdu = ref(false);
    const showPub = ref(false);

    const showEduImage = () => {
      showEdu.value = true;
    };

    const hideEduImage = () => {
      showEdu.value = false;
    };

    const showPubImage = () => {
      showPub.value = true;
    };

    const hidePubImage = () => {
      showPub.value = false;
    };

    return { showEdu, showPub, showEduImage, hideEduImage, showPubImage, hidePubImage };
  },
};
</script>

  
  <style lang="css" scoped>
.edu-pub-container {
  width: 100%;
}

.section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100vh;
  padding: 2rem 5%;
  background-color: #000;
  position: relative;
}

/* EDU Section con sfumatura vivace */
.edu-section {
  background: radial-gradient(
      circle at 70% 50%, /* Sfumatura centrata verso l'immagine */
      rgba(43, 180, 105, 0.6), /* Verde più intenso e vivido */
      rgba(0, 0, 0, 1) 60% /* Nero profondo sulla parte del testo */
  );
  color: #e0e0e0;
}

/* PUB Section con sfumatura vivace */
.pub-section {
  background: radial-gradient(
      circle at 70% 50%, /* Sfumatura centrata verso l'immagine */
      rgba(190, 61, 87, 0.6), /* Bordeaux più intenso e vivido */
      rgba(0, 0, 0, 1) 60% /* Nero profondo sulla parte del testo */
  );
  color: #e0e0e0;
}

/* Content Styling */
.content {
  flex: 1;
  max-width: 50%;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.8;
}

.button {
  display: inline-block;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s ease;
}

/* EDU Button */
.edu-section .button {
  background: rgba(43, 140, 105, 0.8);
  border: 1px solid rgba(43, 140, 105, 0.5);
}

.edu-section .button:hover {
  background: rgba(43, 140, 105, 1);
}

/* PUB Button */
.pub-section .button {
  background: rgba(166, 61, 87, 0.8);
  border: 1px solid rgba(166, 61, 87, 0.5);
}

.pub-section .button:hover {
  background: rgba(166, 61, 87, 1);
}

/* Image Styling */
.section-image {
  flex: 1;
  max-width: 40%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
}

/* Responsive Design */
@media (max-width: 768px) {
  .section {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }

  .content {
    max-width: 100%;
  }

  .section-image {
    max-width: 80%;
    margin-top: 1rem;
  }

  .title {
    font-size: 1.8rem;
  }

  .description {
    font-size: 1rem;
  }

  .button {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
}


  </style>