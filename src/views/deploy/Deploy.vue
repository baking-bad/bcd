<template>
    <v-row class="px-12 mt-5">
        <v-col cols="8" offset="2">
            <p class="ml-6 title">Deploy contract</p>
            <v-stepper v-model="step" vertical class="elevation-0 transparent">
                <!-- Step 1 -->
                <v-stepper-step :complete="step > 1" edit-icon="mdi-sync" editable step="1">
                    Upload code
                </v-stepper-step>

                <v-stepper-content step="1">
                    <v-card class="mb-0 transparent" elevation="0">
                        <v-card-text>
                            <span class="caption">You can deploy a contract by downloading a michelson code file. The file size should not exceed 1 MB.</span>
                            <p class="caption font-italic">Tip: You can download the file from the code tab of any contract.</p>
                            <v-file-input 
                                v-model="file" 
                                @change="fileUploadErrorText = ''" 
                                show-size label="Michelson code file" 
                                prepend-icon="mdi-code-json"
                                :rules="fileRules"></v-file-input>
                            <v-alert v-if="fileUploadErrorText != ''" prominent type="error" text class="ma-0 align-center">
                            {{ fileUploadErrorText }}
                            </v-alert>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" ripple text :loading="loading" @click="step1">
                                Continue
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-stepper-content>


                <!-- Step 2 -->
                <v-stepper-step :complete="step > 2" step="2">
                    Configure contract's initial storage
                </v-stepper-step>

                <v-stepper-content step="2" class="mx-0 px-0">
                    <v-card class="mb-0 transparent" elevation="0" v-if="code" >
                        <v-card-text>
                            <v-row no-gutters>
                                <v-col cols="8" class="pr-4">
                                    <Schema
                                        title="Deploy"
                                        type="deploy"
                                        header="Storage"
                                        :isStorage="true"
                                        :schema="code.storage.schema"
                                        :script="code.script"
                                        v-model="code.storage.default_model"
                                    />
                                </v-col>
                                <v-col cols="4" class="pl-4">
                                    <v-skeleton-loader :loading="loading" type="card-heading, image">
                                        <v-card tile flat outlined class="pa-0">
                                            <v-card-text class="data">
                                            <span class="hash ml-2 text--primary" style="font-size: 15px; font-weight: 400;">Storage type</span>
                                            <TypeDef :typedef="code.storage.type" first="storage" class="pt-4 px-2" />
                                            </v-card-text>
                                        </v-card>
                                    </v-skeleton-loader>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-stepper-content>
            </v-stepper>
        </v-col>
    </v-row>
</template>

<script>
import Schema from "@/components/schema/Schema.vue";
import TypeDef from "@/views/contract/TypeDef.vue";

export default {
    name: "Deploy",
    components: {
        Schema,
        TypeDef
    },
    data () {
      return {
        step: 1,
        file: null,
        fileRules: [
            value => !value || value.size < 1000000 || 'Code file size should be less than 1MB'
        ],
        loading: false,
        code: undefined,
        fileUploadErrorText: '',
      }
    },
    methods: {
        step1() {
            if (this.file === null) {
                this.fileUploadErrorText = 'You should select file to upload'
                return;
            }

            this.loading = true;
            this.fileUploadError = false;

            this.api.getCodeFromMichelson(this.file)
            .then(res => {
                this.code = res;
                this.step = 2;
            })
            .catch(err => {
                console.error(err);
                this.fileUploadErrorText = 'Error occured during upload file. Please, check file format and size.';
            })
            .finally(() => {
                this.loading = false;
            })
        }
    }
}
</script>
