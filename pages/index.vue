<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";

const auth0 = useAuth0();

console.log(auth0);

definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <div>
    <VCard class="mb-6" title="Auth0">
      <VCardText v-if="auth0"> User:{{ auth0.user }} </VCardText>
      <VCardText v-if="auth0">
        Token: {{ auth0.idTokenClaims.value?.__raw }}
      </VCardText>
      <VCardText v-if="auth0"> Token2: {{ auth0 }} </VCardText>
    </VCard>

    <VCard title="Want to integrate JWT? 🔒">
      <VCardText
        >We carefully crafted JWT flow so you can implement JWT with ease and
        with minimum efforts.</VCardText
      >
      <VCardText
        >Please read our JWT Documentation to get more out of JWT
        authentication.</VCardText
      >
    </VCard>
  </div>
</template>
