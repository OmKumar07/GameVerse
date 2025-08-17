import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  VStack,
  HStack,
  Switch,
  Text,
  Select,
  FormControl,
  FormLabel,
  useToast,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import apiClient from "../../services/auth-api-client";

interface PrivacySettings {
  profilePrivacy: "public" | "friends" | "private";
  showEmail: boolean;
  showGameStats: boolean;
  showFavoriteGames: boolean;
  showPlayedGames: boolean;
  showCustomLists: boolean;
  showBio: boolean;
  showLocation: boolean;
}

const PrivacySettingsCard = () => {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<PrivacySettings>({
    profilePrivacy: "public",
    showEmail: false,
    showGameStats: true,
    showFavoriteGames: true,
    showPlayedGames: true,
    showCustomLists: true,
    showBio: true,
    showLocation: true,
  });

  // Initialize settings from user data
  useEffect(() => {
    if (user) {
      setSettings({
        profilePrivacy: user.profilePrivacy || "public",
        showEmail: user.showEmail || false,
        showGameStats: user.showGameStats !== false,
        showFavoriteGames: user.showFavoriteGames !== false,
        showPlayedGames: user.showPlayedGames !== false,
        showCustomLists: user.showCustomLists !== false,
        showBio: user.showBio !== false,
        showLocation: user.showLocation !== false,
      });
    }
  }, [user]);

  const handleSettingChange = (key: keyof PrivacySettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveSettings = async () => {
    setIsLoading(true);

    try {
      await apiClient.updateProfile(settings);
      await refreshUser();

      toast({
        title: "Privacy Settings Updated",
        description: "Your privacy preferences have been saved successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description:
          error.response?.data?.message || "Failed to update privacy settings",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPublicProfileUrl = () => {
    if (user?.username) {
      return `${window.location.origin}/user/${user.username}`;
    }
    return "";
  };

  return (
    <Card>
      <CardHeader>
        <HStack justify="space-between">
          <Heading size="md">Privacy Settings</Heading>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={saveSettings}
            isLoading={isLoading}
          >
            Save Changes
          </Button>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack spacing={6} align="stretch">
          {/* Profile Visibility */}
          <Box>
            <FormControl>
              <FormLabel fontWeight="semibold">Profile Visibility</FormLabel>
              <Select
                value={settings.profilePrivacy}
                onChange={(e) =>
                  handleSettingChange("profilePrivacy", e.target.value)
                }
              >
                <option value="public">
                  Public - Anyone can view your profile
                </option>
                <option value="friends">
                  Friends Only - Only friends can view your profile
                </option>
                <option value="private">
                  Private - Profile is not visible to others
                </option>
              </Select>
            </FormControl>

            {settings.profilePrivacy === "public" && user?.username && (
              <Text fontSize="sm" color="gray.600" mt={2}>
                Your public profile:{" "}
                <Text as="span" color="blue.500" fontFamily="mono">
                  {getPublicProfileUrl()}
                </Text>
              </Text>
            )}
          </Box>

          {/* Information Visibility */}
          <Box>
            <Text fontWeight="semibold" mb={3}>
              Information Visibility
            </Text>
            <VStack spacing={3} align="stretch">
              <HStack justify="space-between">
                <Text>Show email address</Text>
                <Switch
                  isChecked={settings.showEmail}
                  onChange={(e) =>
                    handleSettingChange("showEmail", e.target.checked)
                  }
                />
              </HStack>

              <HStack justify="space-between">
                <Text>Show bio</Text>
                <Switch
                  isChecked={settings.showBio}
                  onChange={(e) =>
                    handleSettingChange("showBio", e.target.checked)
                  }
                />
              </HStack>

              <HStack justify="space-between">
                <Text>Show location</Text>
                <Switch
                  isChecked={settings.showLocation}
                  onChange={(e) =>
                    handleSettingChange("showLocation", e.target.checked)
                  }
                />
              </HStack>
            </VStack>
          </Box>

          {/* Gaming Data Visibility */}
          <Box>
            <Text fontWeight="semibold" mb={3}>
              Gaming Data Visibility
            </Text>
            <VStack spacing={3} align="stretch">
              <HStack justify="space-between">
                <Text>Show gaming statistics</Text>
                <Switch
                  isChecked={settings.showGameStats}
                  onChange={(e) =>
                    handleSettingChange("showGameStats", e.target.checked)
                  }
                />
              </HStack>

              <HStack justify="space-between">
                <Text>Show favorite games</Text>
                <Switch
                  isChecked={settings.showFavoriteGames}
                  onChange={(e) =>
                    handleSettingChange("showFavoriteGames", e.target.checked)
                  }
                />
              </HStack>

              <HStack justify="space-between">
                <Text>Show played games</Text>
                <Switch
                  isChecked={settings.showPlayedGames}
                  onChange={(e) =>
                    handleSettingChange("showPlayedGames", e.target.checked)
                  }
                />
              </HStack>

              <HStack justify="space-between">
                <Text>Show custom lists</Text>
                <Switch
                  isChecked={settings.showCustomLists}
                  onChange={(e) =>
                    handleSettingChange("showCustomLists", e.target.checked)
                  }
                />
              </HStack>
            </VStack>
          </Box>

          {/* Privacy Tips */}
          <Box
            bg="blue.50"
            p={4}
            borderRadius="md"
            borderLeft="4px"
            borderLeftColor="blue.400"
          >
            <Text fontWeight="semibold" mb={2}>
              Privacy Tips
            </Text>
            <VStack spacing={1} align="start" fontSize="sm" color="gray.700">
              <Text>
                • Public profiles can be found in user search and are visible to
                everyone
              </Text>
              <Text>
                • Friends-only profiles are only visible to users you follow or
                who follow you
              </Text>
              <Text>
                • Private profiles are completely hidden from other users
              </Text>
              <Text>
                • Individual custom lists can be set as public or private
                regardless of these settings
              </Text>
            </VStack>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default PrivacySettingsCard;
