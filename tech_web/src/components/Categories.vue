<template>
    <div>
        <label for="category">Chọn danh mục:</label>
        <select :key="categories.length" v-model="selectedCategory" @change="emitCategory">
            <option value="all">Tất cả</option>
            <template v-if="categories.length">
                <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </template>
        </select>
        <p v-if="error" class="error-message">{{ error }}</p>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "ComCategories",
    data() {
        return {
            categories: [],
            selectedCategory: "all",
            error: null,
        };
    },
    computed: {
        computedSelectedCategory: {
            get() {
                return this.selectedCategory;
            },
            set(value) {
                this.selectedCategory = value;
                this.emitCategory();
            },
        },
    },
    methods: {
        async fetchCategories() {
            try {
                const response = await axios.get("http://localhost:3000/categories");
                this.categories = response.data;
            } catch (error) {
                this.error = "Không thể lấy danh mục. Vui lòng thử lại!";
                console.error("Lỗi khi lấy danh mục:", error);
            }
        },
        emitCategory() {
            const categoryId = this.selectedCategory !== "all" ? this.selectedCategory : "";
            this.$emit("category-selected", categoryId);
        },
    },
    mounted() {
        this.fetchCategories();
    },
};
</script>

<style scoped>
.error-message {
    color: red;
    font-size: 14px;
    margin-top: 5px;
}
</style>
