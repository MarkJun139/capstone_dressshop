import React, { useState, useEffect } from 'react';
import { Box, Flex, Input, Button, Grid, Image, Text, Checkbox } from '@chakra-ui/react';

const products = [
  {
    id: 1,
    name: '청바지',
    price: 50000,
    category: '바지',
    image: '/images/jeans.jpg',
  },
  {
    id: 2,
    name: '티셔츠',
    price: 20000,
    category: '상의',
    image: '/images/tshirt.jpg',
  },
  {
    id: 3,
    name: '원피스',
    price: 80000,
    category: '원피스',
    image: '/images/dress.jpg',
  },
  {
    id: 4,
    name: '스커트',
    price: 40000,
    category: '스커트',
    image: '/images/skirt.jpg',
  },
  {
    id: 5,
    name: '셔츠',
    price: 30000,
    category: '상의',
    image: '/images/shirt.jpg',
  },
];

const Main = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    filterProducts(searchValue, selectedCategories);
  }, [searchValue, selectedCategories]);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedCategories((prevCategories) => [...prevCategories, value]);
    } else {
      setSelectedCategories((prevCategories) =>
        prevCategories.filter((category) => category !== value)
      );
    }
  };

  const filterProducts = (value, categories) => {
    setLoading(true);
    setTimeout(() => {
      let filtered;
      if (categories.length === 0) {
        filtered = products;
      } else {
        filtered = products.filter(
          (product) =>
            (product.name.toLowerCase().includes(value.toLowerCase()) || value === '') &&
            categories.includes(product.category)
        );
      }
      setFilteredProducts(filtered);
      setLoading(false);
    }, 500);
  };

  return (
    <Box p={4}>
      <Flex align="center" mb={4}>
        <Input
          id="serch"
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchValue}
          onChange={handleSearchChange}
          size="lg"
          mr={2}
        />
        <Button
          colorScheme="teal"
          size="lg"
          bg="white"
          border="1px"
          borderColor="black"
          color="black"
        >
          검색
        </Button>
      </Flex>

      <Box display="flex" alignItems="center" mb={4}>
        <Text fontSize="lg" mr={2} flexShrink={0}>
          카테고리:
        </Text>
        <Flex flexWrap="wrap">
          <Checkbox
            id="pants"
            value="바지"
            onChange={handleCategoryChange}
            isChecked={selectedCategories.includes('바지')}
            size="lg"
            mr={2}
            mb={2}
          >
            바지
          </Checkbox>
          <Checkbox
            id="top"
            value="상의"
            onChange={handleCategoryChange}
            isChecked={selectedCategories.includes('상의')}
            size="lg"
            mr={2}
            mb={2}
          >
            상의
          </Checkbox>
          <Checkbox
            id="onepiece"
            value="원피스"
            onChange={handleCategoryChange}
            isChecked={selectedCategories.includes('원피스')}
            size="lg"
            mr={2}
            mb={2}
          >
            원피스
          </Checkbox>
          <Checkbox
            id="skirt"
            value="스커트"
            onChange={handleCategoryChange}
            isChecked={selectedCategories.includes('스커트')}
            size="lg"
            mb={2}
          >
            스커트
          </Checkbox>
        </Flex>
      </Box>

      {loading ? (
        <Text fontSize="xl">로딩 중...</Text>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
          {filteredProducts.map((product) => (
            <Box key={product.id} borderWidth="1px" borderRadius="md" overflow="hidden">
              <Image src={product.image} alt={product.name} height={250} objectFit="cover" />

              <Box p={4}>
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  {product.name}
                </Text>
                <Text fontSize="lg" color="gray.500" mb={2}>
                  {product.price}원
                </Text>
                <Text fontSize="md" color="gray.500" mb={2}>
                  카테고리: {product.category}
                </Text>
                <Button
                  colorScheme="teal"
                  size="sm"
                  width="full"
                  bg="white"
                  border="1px"
                  borderColor="black"
                  color="black"
                >
                  상품보기
                </Button>
              </Box>
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Main;
