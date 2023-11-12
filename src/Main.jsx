import React, { useState } from 'react';
import { Box, Flex, Input, Grid, Image, Text } from '@chakra-ui/react';

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

const Main = ({ selectedCategory, onDetail }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredProducts = products.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchValue.toLowerCase()) || searchValue === '') &&
      (selectedCategory === null || product.category === selectedCategory)
  );

  const renderAllProducts = () => {
    if (selectedCategory === '') {
      return products.map((product) => (
        <Box
          key={product.id}
          borderWidth="1px"
          borderRadius="md"
          overflow="hidden"
          onClick={() => onDetail(product)}
          cursor="pointer"
        >
          <Image src={product.image} alt={product.name} height={250} objectFit="cover" />
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              {product.name}
            </Text>
            <Text fontSize="lg" color="gray.500" mb={2}>
              {product.price}원
            </Text>
            <Text fontSize="md" color="gray.500" mb={2}>
              카테고리: {product.category}
            </Text>
          </Box>
        </Box>
      ));
    } else {
      return filteredProducts.map((product) => (
        <Box
          key={product.id}
          borderWidth="1px"
          borderRadius="md"
          overflow="hidden"
          onClick={() => onDetail(product)}
          cursor="pointer"
        >
          <Image src={product.image} alt={product.name} height={250} objectFit="cover" />
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              {product.name}
            </Text>
            <Text fontSize="lg" color="gray.500" mb={2}>
              {product.price}원
            </Text>
            <Text fontSize="md" color="gray.500" mb={2}>
              카테고리: {product.category}
            </Text>
          </Box>
        </Box>
      ));
    }
  };

  return (
    <Box>
      <Flex>
        <Input
          id="search"
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchValue}
          onChange={handleSearchChange}
          size="lg"
        />
      </Flex>

      <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={3}>
        {renderAllProducts()}
      </Grid>
    </Box>
  );
};

export default Main;
